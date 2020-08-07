const express = require("express");
const ingestionController = require("./../controllers/ingestion-controller");
const { authCron, authDebug } = require("./../authentication");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "/tmp" });

/* !!! WARNING !!!
 * For development/testing, run server with yarn start_test
 * and run the local java emulator!
 * Otherwise, these endpoints will write directly to our
 * live firestore DB which may incur large costs
 */

// Sync Firestore with config files in Cloud Bucket
// Ensure first that trusted header from AppEngine cronjob is set
// usage:
// curl -H "X-Appengine-Cron:true" localhost:3143/ingest/sync
router.get("/sync", authCron, ingestionController.sync);

// DEBUGGING ENDPOINTS //
// Add merchant for onboarding (debugging ONLY)
// Post with body a Json object describing the new merchant
// to write into merchants.csv (as a new data row)
// usage:
// curl -X POST -d "@filename" localhost:3143/ingest/merchant
router.post("/merchant", authDebug, ingestionController.addMerchant);

// Upload file to cloud bucket
// Upload a local file onto our cloud bucket attached to proj
// usage:
// curl -F "file=@filename" localhost:3143/ingest/upload
router.post(
  "/upload",
  authDebug,
  upload.single("file"),
  ingestionController.uploadFile
);

// Reset ingestion timestamp
// This is mainly used to conviniently force a re-Sync
// usage:
// curl localhost:3143/ingest/resetSync
router.get("/resetSync", authDebug, ingestionController.resetSyncTiming);

module.exports = router;
