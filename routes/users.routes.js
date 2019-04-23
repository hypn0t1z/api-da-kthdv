var express = require('express')
var userRouter = express.Router()
const UserController = require('../controllers/user.controller')
const UserMiddleWare = require('../middlewares/user.middleware')

/**
 * Middlewares
 */
userRouter.get('/phone/:phone', (req, res, next) => UserMiddleWare.getUserByPhone(req, res, next));
userRouter.get('/:id/profile', (req, res, next) => UserMiddleWare.getUserProfile(req, res, next));
userRouter.post('/:id/provider', (req, res, next) => UserMiddleWare.createProvider(req, res, next))
userRouter.get('/:id', (req, res, next) => UserMiddleWare.getAccount(req, res, next))

/**
 * Controllers
 */
userRouter.get('/', (req, res) => UserController.getUser(req, res));
userRouter.get('/phone/:phone', (req, res) => UserController.getUserByPhone(req, res))

userRouter.get('/:id/profile', (req, res) => UserController.getUserProfile(req, res))

userRouter.get('/:id/provider', (req, res) => UserController.getProvider(req, res));
userRouter.post('/:id/provider', (req, res) => UserController.createProvider(req, res));

userRouter.get('/:id', (req, res) => UserController.getAccount(req, res))


module.exports = userRouter