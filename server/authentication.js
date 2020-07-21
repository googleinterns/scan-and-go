const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const {
  HTTP_UNAUTHORIZED,
  IPv4_LOOPBACK,
  IPv6_LOOPBACK,
  GAE_PRIVATE_IP,
} = require("./constants");

const client = jwksClient({
  jwksUri: "https://www.googleapis.com/oauth2/v3/certs",
});

const getKey = (header, keyCallback) => {
  client.getSigningKey(header.kid, function (err, key) {
    if (key) {
      keyCallback(null, key.publicKey || key.rsaPublicKey);
    } else {
      keyCallback(new Error("key in token not found in jkws"), null);
    }
  });
};

const authenticateUser = (req, res, next) => {
  if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    return res.sendStatus(HTTP_UNAUTHORIZED);
  }
  const token = req.headers.authorization.split(" ")[1];
  const options = {
    audience:
      process.env.EXPRESS_SERVER_MICROAPPS_CLIENT_ID || "invalid audience",
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    // TODO (#149): implement more secure nonce + configure web flow to use nonce
    // nonce: "static nonce",
  };
  jwt.verify(token, getKey, options, (err, decoded) => {
    if (err) {
      return next(err);
    }
    req.userId = decoded.sub;
    return next();
  });
};

const CronAuth = (req, res, next) => {
  // https://cloud.google.com/appengine/docs/flexible/nodejs/scheduling-jobs-with-cron-yaml#validating_cron_requests
  // 'X-Appengine-Cron' is a trusted header which is stripped from
  // client requests external to AppEngine. Therefore, we can use
  // this check to verify that we are calling an endpoint from CronJob
  if (req.header("X-Appengine-Cron") !== "true") {
    return res.sendStatus(HTTP_UNAUTHORIZED);
  }
  // Furthermore, requests from CronJob are send from the IP 10.0.0.1
  // which is a private IP address invalid for external routing
  // We can make a further check here to be sure requester is CronJob
  // ::1 is for local IPv6 loopback address when debugging using curl
  if (
    req.connection.remoteAddress !== IPv6_LOOPBACK &&
    req.connection.remoteAddress !== IPv4_LOOPBACK &&
    req.connection.remoteAddress !== GAE_PRIVATE_IP
  ) {
    return res.sendStatus(HTTP_UNAUTHORIZED);
  }
  return next();
};

const DebugAuth = (req, res, next) => {
  // Ensure we protect endpoints behind a local config
  if (
    req.connection.remoteAddress !== IPv6_LOOPBACK &&
    req.connection.remoteAddress !== IPv4_LOOPBACK
  ) {
    return res.sendStatus(HTTP_UNAUTHORIZED);
  }
  return next();
};

module.exports = authenticateUser;
module.exports.CronAuth = CronAuth;
module.exports.DebugAuth = DebugAuth;
