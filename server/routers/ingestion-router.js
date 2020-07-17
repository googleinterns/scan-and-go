const express = require("express");
const ingestionController = require("./../controllers/ingestion-controller");
const router = express.Router();

// Sync
router.get("/sync", ingestionController.sync);

// Update
router.get("/update", ingestionController.update);

module.exports = router;
