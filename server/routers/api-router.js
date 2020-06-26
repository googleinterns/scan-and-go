const express = require("express");
const apiController = require("./../controllers/api-controller");
const usersController = require("./../controllers/users-controller");
const itemsController = require("./../controllers/items-controller");
const storesController = require("./../controllers/stores-controller");
const ordersController = require("./../controllers/orders-controller");
const authenticateUser = require("./../authentication");
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

// Order API
router.post("/order", ordersController.addOrder);
router.use("/order/list", authenticateUser);
router.get("/order/list", ordersController.listOrders);
// router.get("/order/list", authenticateUser, ordersController.listOrders);
// TODO: not sure why this line causes multiple unit tests to take much longer and fail due to timeout
//       when it should behave the same as the previous two lienes

module.exports = router;
