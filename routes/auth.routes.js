var express = require('express')
var authRouter = express.Router()
const { AuthMiddleware } = require('../middlewares/auth.middleware');
const AuthController = require('../controllers/auth.controller');
const AuthPublicController = require('../controllers/auth.pub.controller');

/**
 * Middleware router to check login & register
 * @author Hung Dang
 */
authRouter.post('/login', (req, res, next) => AuthMiddleware.login(req, res, next));
authRouter.post('/register', (req, res, next) => AuthMiddleware.register(req, res, next));
authRouter.post('/profile/:id', (req, res, next) => AuthMiddleware.createProfile(req, res, next));
authRouter.post('/before/register', (req, res, next) => AuthMiddleware.beforeRegister(req, res, next));

/**
 * Validate succes will process controller
 * 
 */
authRouter.post('/login', (req, res) => AuthController.login(req, res));
authRouter.post('/register', (req, res) => AuthController.register(req, res));
authRouter.post('/profile/:id', (req, res) => AuthController.createProfile(req, res));
authRouter.get('/profile/:id', (req, res) => AuthController.getProfile(req, res));
authRouter.post('/before/register', (req, res) => AuthController.beforeRegister(req, res));

/**
 * public api
 * @type {Router}
 */
authRouter.post('/phoneExist', (req, res) => AuthPublicController.phoneExist(req, res));


module.exports = authRouter