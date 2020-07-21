const express = require("express");
const ingestionController = require("./../controllers/ingestion-controller");
const { authCron, authDebug } = require("./../authentication");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "/tmp" });

// Sync
// Ensure first that trusted header from AppEngine cronjob is set
// for debugging it is sufficient to do:
// curl -H "X-Appengine-Cron:true" localhost:3143/ingest/sync
router.get("/sync", authCron, ingestionController.sync);

// DEBUGGING ENDPOINTS //
// Add merchant for onboarding (debugging ONLY)
// curl -X POST -d "@filename" localhost:3143/ingest/merchant
router.post("/merchant", authDebug, ingestionController.addMerchant);

// Upload file to cloud bucket
// usage:
// curl -X POST -d "@filename" localhost:3143/ingest/upload
router.post(
  "/upload",
  authDebug,
  upload.single("file"),
  ingestionController.uploadFile
);

module.exports = router;
