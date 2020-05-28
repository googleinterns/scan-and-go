const express = require('express')
const usersController = require('./../controllers/users-controller.js')
const router = express.Router()
router.get('/all', usersController.usersGetAll)
module.exports = router
