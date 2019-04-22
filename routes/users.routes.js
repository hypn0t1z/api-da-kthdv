var express = require('express')
var userRouter = express.Router()
const UserController = require('../controllers/user.controller')
const UserMiddleWare = require('../middlewares/user.middleware')

userRouter.get('/phone/:phone', (req, res, next) => UserMiddleWare.getUserByPhone(req, res, next));

userRouter.get('/', (req, res) => UserController.getUser(req, res));
userRouter.get('/phone/:phone', (req, res) => UserController.getUserByPhone(req, res))

module.exports = userRouter