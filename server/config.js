// NODE_ENV strings
const DEV = "development";
const PROD = "production";
const TEST = "test";

module.exports = {
  DEV: DEV,
  PROD: PROD,
  TEST: TEST,
  ENV: process.env.NODE_ENV || DEV,
  DEV_PORT: 3143,
};
