// NODE_ENV strings
const DEV = "development";
const PROD = "production";

module.exports = {
  DEV: DEV,
  PROD: PROD,
  ENV: process.env.NODE_ENV || DEV,
  DEV_PORT: 3143,
};
