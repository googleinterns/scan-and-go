const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
  jwksUri: "https://www.googleapis.com/oauth2/v3/certs",
});

const keys = require("./client_secret.json").web;

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
  if (!req.headers.authorization) {
    return next();
  }
  // assert(req.headers.authorization.split(' ')[0] === 'Bearer');
  const token = req.headers.authorization.split(" ")[1];
  const nonce = req.headers["x-nonce"];
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
