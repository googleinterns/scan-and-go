const users = require("./../data/users.json");
const homeController = require("./home-controller");
const usersController = require("./users-controller");
const storesController = require("./stores-controller");

exports.storesGet = storesController.storesGet;
exports.storeGet = storesController.storeGet;
exports.msgGet = homeController.homeGet;
exports.usersGetAll = usersController.usersGetAll;
