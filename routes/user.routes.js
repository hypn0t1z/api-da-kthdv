var express = require('express')
var userRouter = express.Router();
const UserController = require('../controllers/user.controller')

userRouter.get('/', (req, res) => UserController.getUser(req, res));

module.exports = userRouter;