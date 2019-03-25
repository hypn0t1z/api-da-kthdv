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

/**
 * Validate succes will process controller
 * 
 */
authRouter.post('/login', (req, res) => AuthController.login(req, res));
authRouter.post('/register', (req, res) => AuthController.register(req, res));

module.exports = authRouter