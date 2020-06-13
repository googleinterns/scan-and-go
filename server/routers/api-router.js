const express = require("express");
const apiController = require("./../controllers/api-controller");
const usersController = require("./../controllers/users-controller");
const itemsController = require("./../controllers/items-controller");
const storesController = require("./../controllers/stores-controller");
const router = express.Router();

// Debugging Endpoints
router.post("/", apiController.getWelcomeMessage);
router.get("/user/list", usersController.listUsers);

// Store API
router.post("/store", storesController.getStore);
router.post("/store/list", storesController.listStores); //Batch Operation

// Users API
router.post("/user", usersController.getUser);

// Items API
router.post("/item", itemsController.getItem);
router.post("/item/list", itemsController.listItems); //Batch Operation

module.exports = router;
