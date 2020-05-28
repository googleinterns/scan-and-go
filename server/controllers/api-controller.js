const users = require('./../data/users.json')
const homeController = require('./home-controller')
const usersController = require('./users-controller')

exports.msgGet = homeController.homeGet
exports.usersGetAll = usersController.usersGetAll
