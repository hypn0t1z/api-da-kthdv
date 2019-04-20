var express = require('express')
var userRouter = express.Router()
const userController = require('../controllers/user.controller')
const userMiddleWare = require('../middlewares/user.middleware')

userRouter.get('/phone/:phone', (req, res, next) => userMiddleWare.getUserByPhone(req, res, next));


userRouter.get('/phone/:phone', (req, res) => userController.getUserByPhone(req, res))

module.exports = userRouter