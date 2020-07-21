const express = require("express");
const apiController = require("./../controllers/api-controller");
const usersController = require("./../controllers/users-controller");
const itemsController = require("./../controllers/items-controller");
const storesController = require("./../controllers/stores-controller");
const ordersController = require("./../controllers/orders-controller");
const { authUser } = require("./../authentication");
const router = express.Router();

// Debugging Endpoints
router.post("/", apiController.getWelcomeMessage);
router.get("/user/list", usersController.listUsers);

// Nonce Endpoint
// TODO (#149): implement more secure nonce
router.get("/nonce", (req, res) => res.send("static nonce"));

// Store API
router.post("/store", storesController.getStore);
router.post("/store/list", storesController.listStores); //Batch Operation

// Users API
router.post("/user", usersController.getUser);

// Items API
router.post("/item", itemsController.getItems); //Batch Operation

// Order API
router.post("/order/add", authUser, ordersController.addOrder);
router.post("/order/update", authUser, ordersController.updateOrder);
router.get("/order/list", authUser, ordersController.listOrders);
router.get(
  "/order/merchants/:merchantId/orders/:orderId",
  authUser,
  ordersController.getOrder
);

module.exports = router;
