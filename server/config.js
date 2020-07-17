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
  CLOUD_BUCKET: "scan-and-go-for-gpay-storage",
  DOWNLOAD_FOLDER: "data",
  MERCHANTS_INGESTION_CSV: "merchants.csv",
};
