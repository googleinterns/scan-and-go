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
  // Statically defined headers for now
  // These are internal (server) field keys for objects built
  // from business-provided .csv files
  // We understand columns via ordering
  //TODO(#): File verification via server-side config?
  MERCHANTS_CSV_HEADERS: [
    "Merchant ID",
    "Microapp ID",
    "payeeVpa",
    "Name",
    "Items",
    "Stores",
  ],
  ITEMS_CSV_HEADERS: ["Index", "Barcode", "Name", "Price", "Unit", "Details"],
  STORES_CSV_HEADERS: ["Index", "Store ID", "Name", "Address"],
};
