var express = require('express')
var authRouter = express.Router()
const { AuthMiddleware } = require('../middlewares/auth.middleware');
const AuthController = require('../controllers/auth.controller');
/**
 * Middleware router to check login & register
 * @author Hung Dang
 */
authRouter.post('/login', (req, res, next) => AuthMiddleware.login(req, res, next));
authRouter.post('/register', (req, res, next) => AuthMiddleware.register(req, res, next));
authRouter.post('/before/register', (req, res, next) => AuthMiddleware.beforeRegister(req, res, next));
authRouter.get('/confirm-register/:mail_token', (req, res, next) => AuthMiddleware.confirmRegister(req, res, next))
authRouter.get('/is-token-still-alive/:token', (req, res, next) => AuthMiddleware.isTokenStillAlive(req, res, next))
authRouter.post('/upload-avatar/', (req, res, next) => AuthMiddleware.uploadAvatar(req, res, next))

/**
 * Validate succes will process controller
 *
 */
authRouter.post('/login', (req, res) => AuthController.login(req, res));
authRouter.post('/register', (req, res) => AuthController.register(req, res));
authRouter.get('/profile/:id', (req, res) => AuthController.getProfile(req, res)); // id = account_id
authRouter.post('/before/register', (req, res) => AuthController.beforeRegister(req, res));
authRouter.post('/upload-avatar/', (req, res) => AuthController.uploadAvatar(req, res))

/**
 * Confirm api
 * @type {Router}
 */
authRouter.get('/confirm-register/:mail_token', (req, res) => AuthController.confirmRegister(req, res))

module.exports = authRouter