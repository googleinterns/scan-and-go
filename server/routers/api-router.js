const express = require("express");
const apiController = require("./../controllers/api-controller.js");
const usersRouter = require("./users-router");
const router = express.Router();

router.post("/stores", apiController.storesGet);
router.post("/store", apiController.storeGet);
router.post("/", apiController.msgGet);
router.use("/users", usersRouter);
router.post("/items", apiController.itemsGet);

module.exports = router;
