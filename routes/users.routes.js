var express = require('express')
var userRouter = express.Router()
const UserController = require('../controllers/user.controller')
const UserMiddleWare = require('../middlewares/user.middleware');
const { accessToken } = require('../middlewares/auth.middleware');

/**
 * Middlewares
 */
userRouter.get('/phone/:phone', (req, res, next) => UserMiddleWare.getUserByPhone(req, res, next));

// provider
userRouter.post('/:id/create-provider', accessToken, (req, res, next) => UserMiddleWare.createProvider(req, res, next))
userRouter.patch('/:id/update-provider', accessToken, (req, res, next) => UserMiddleWare.updateProvider(req, res, next))
userRouter.get('/:id', (req, res, next) => UserMiddleWare.getAccount(req, res, next))

// profile
userRouter.get('/:id/profile', (req, res, next) => UserMiddleWare.getUserProfile(req, res, next));
userRouter.post('/:id/create-profile', accessToken, (req, res, next) => UserMiddleWare.create(req, res, next));
userRouter.patch('/:id/update-profile', accessToken, (req, res, next) => UserMiddleWare.update(req, res, next));

/**
 * Controllers
 */
userRouter.get('/', (req, res) => UserController.getUser(req, res));
userRouter.get('/phone/:phone', (req, res) => UserController.getUserByPhone(req, res))

// profile
userRouter.get('/:id/check-profile', (req, res) => UserController.isExistProfile(req, res)); // account_id
userRouter.get('/:id/profile', (req, res) => UserController.getUserProfile(req, res)); // account_id
userRouter.post('/:id/create-profile', accessToken, (req, res) => UserController.createProfile(req, res)); 
userRouter.patch('/:id/update-profile', accessToken, (req, res) => UserController.updateProfile(req, res)); // account_id

// Provider
userRouter.get('/search/provider', (req, res) => UserController.getProviderByKeyword(req, res)); // search provider by key_words
userRouter.get('/:id/provider', (req, res) => UserController.getProvider(req, res)); //account_id
userRouter.post('/:id/create-provider', accessToken, (req, res) => UserController.createProvider(req, res)); // account_id
userRouter.patch('/:id/update-provider', accessToken, (req, res) => UserController.updateProvider(req, res)); // account_id
userRouter.delete('/:id/delete-provider', accessToken, (req, res) => UserController.deleteProvider(req, res)); // account_id

// account
userRouter.get('/:id', (req, res) => UserController.getAccount(req, res));

// block account
userRouter.get('/block/:id', accessToken, (req, res) => UserController.blockAccount(req, res))


module.exports = userRouter