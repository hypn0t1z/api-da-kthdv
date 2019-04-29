var express = require('express')
var userRouter = express.Router()
const UserController = require('../controllers/user.controller')
const UserMiddleWare = require('../middlewares/user.middleware')

/**
 * Middlewares
 */
userRouter.get('/phone/:phone', (req, res, next) => UserMiddleWare.getUserByPhone(req, res, next));
// provider
userRouter.post('/:id/provider', (req, res, next) => UserMiddleWare.createProvider(req, res, next))
userRouter.get('/:id', (req, res, next) => UserMiddleWare.getAccount(req, res, next))
// profile
userRouter.get('/:id/profile', (req, res, next) => UserMiddleWare.getUserProfile(req, res, next));
userRouter.post('/:id/create-profile', (req, res, next) => UserMiddleWare.createOrUpdate(req, res, next));
userRouter.patch('/:id/update-profile', (req, res, next) => UserMiddleWare.createOrUpdate(req, res, next));

/**
 * Controllers
 */
userRouter.get('/', (req, res) => UserController.getUser(req, res));
userRouter.get('/phone/:phone', (req, res) => UserController.getUserByPhone(req, res))
// profile
userRouter.get('/:id/check-profile', (req, res) => UserController.isExistProfile(req, res)); // account_id
userRouter.get('/:id/profile', (req, res) => UserController.getUserProfile(req, res)); // account_id
userRouter.post('/:id/create-profile', (req, res) => UserController.createProfile(req, res));
userRouter.patch('/:id/update-profile', (req, res) => UserController.updateProfile(req, res)); // account_id
// provider
userRouter.get('/:id/provider', (req, res) => UserController.getProvider(req, res));
userRouter.post('/:id/provider', (req, res) => UserController.createProvider(req, res));
// account
userRouter.get('/:id', (req, res) => UserController.getAccount(req, res));
// block account
userRouter.get('/block/:id', (req, res) => UserController.blockAccount(req, res))


module.exports = userRouter