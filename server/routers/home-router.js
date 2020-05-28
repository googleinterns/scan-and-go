const express = require('express')
const homeController = require('./../controllers/home-controller.js')
const router = express.Router()
router.post('/', homeController.homeGet)
module.exports = router
