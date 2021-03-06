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
userRouter.post('/:id/create-provider', accessToken, (req, res, next) => UserMiddleWare.createProvider(req, res, next));
userRouter.patch('/:id/update-provider', accessToken, (req, res, next) => UserMiddleWare.updateProvider(req, res, next));
userRouter.get('/:id', (req, res, next) => UserMiddleWare.getAccount(req, res, next));
userRouter.post('/:id/provider/status/:status', accessToken, (req, res, next) => UserMiddleWare.changeStatusProvider(req, res, next));

// profile
userRouter.get('/:id/profile', (req, res, next) => UserMiddleWare.getUserProfile(req, res, next));
userRouter.post('/:id/create-profile', accessToken, (req, res, next) => UserMiddleWare.create(req, res, next));
userRouter.patch('/:id/update-profile', accessToken, (req, res, next) => UserMiddleWare.update(req, res, next));

//service
userRouter.get('/:id/service', (req, res, next) => UserMiddleWare.getProviderServices(req, res, next));
userRouter.get('/:id/service/:service_id', (req, res, next) => UserMiddleWare.getProviderServicesWithId(req, res, next));
userRouter.post('/:id/service', accessToken, (req, res, next) => UserMiddleWare.createProviderService(req, res, next));
userRouter.patch('/:id/service/:service_id', accessToken, (req, res, next) => UserMiddleWare.updateService(req, res, next));
userRouter.delete('/:id/service/:service_id', accessToken, (req, res, next) => UserMiddleWare.deleteService(req, res, next));

//rate
userRouter.get('/:id/rate/:rate_id', (req, res, next) => UserMiddleWare.getRateById(req, res, next));    // rate_id
userRouter.get('/:id/rate/provider/:provider_id', (req, res, next) => UserMiddleWare.getRateByProviderId(req, res, next));
userRouter.post('/:id/rate/create/:provider_id', accessToken, (req, res, next) => UserMiddleWare.createRate(req, res, next));
userRouter.patch('/:id/rate/update/:rate_id', accessToken, (req, res, next) => UserMiddleWare.updateRate(req, res, next));

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
userRouter.post('/:id/provider/status/:status', accessToken, (req, res) => UserController.changeStatusProvider(req, res)); 

// account
userRouter.get('/:id', (req, res) => UserController.getAccount(req, res));

// block account
userRouter.post('/:id/block', accessToken, (req, res) => UserController.blockAccount(req, res))

// unblock account
userRouter.post('/:id/unblock', accessToken, (req, res) => UserController.unblockAccount(req, res))

//service
userRouter.get('/:id/service', (req, res) => UserController.getProviderServices(req, res));
userRouter.get('/:id/service/:service_id', (req, res) => UserController.getProviderServicesWithId(req, res));
userRouter.post('/:id/service', accessToken,  (req, res) => UserController.createProviderService(req, res));
userRouter.patch('/:id/service/:service_id', accessToken, (req, res) => UserController.updateService(req, res));
userRouter.delete('/:id/service/:service_id', accessToken, (req, res) => UserController.deleteService(req, res));

// rate
userRouter.get('/:id/rate/:rate_id', (req, res) => UserController.getRateById(req, res));    // rate_id
userRouter.get('/:id/rate/provider/:provider_id', (req, res) => UserController.getRateByProviderId(req, res));
userRouter.post('/:id/rate/create/:provider_id', accessToken, (req, res) => UserController.createRate(req, res));
userRouter.patch('/:id/rate/update/:rate_id', accessToken, (req, res) => UserController.updateRate(req, res));

module.exports = userRouter