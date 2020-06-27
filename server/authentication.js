const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

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
  const nonce = "static nonce";
  // TODO (#133: replace with REACT_APP_MICROAPPS_CLIENT_ID
  const keys = require("./client_secret.json").web;
  const options = {
    audience: keys.client_id,
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    nonce: nonce,
  };
  jwt.verify(token, getKey, options, (err, decoded) => {
    if (err) {
      return next(err);
    }
    req.userId = decoded.sub;
  });
  return next();
};

module.exports = authenticateUser;
