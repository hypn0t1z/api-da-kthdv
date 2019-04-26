var express = require('express')
var serviceRouter = express.Router();
const ServiceController = require('../controllers/service.controller');
const ServiceMiddleware = require('../middlewares/service.middleware');

/**
 * Middlewares
 */
serviceRouter.post('/create', (req, res, next) => ServiceMiddleware.createService(req, res, next));
serviceRouter.post('/update/:id', (req, res, next) => ServiceMiddleware.updateService(req, res, next));


/**
 * Controllers
 */
serviceRouter.get('/', (req, res) => ServiceController.getList(req, res));
serviceRouter.get('/edit/:id', (req, res) => ServiceController.getEdit(req, res));
serviceRouter.get('/create', (req, res) => ServiceController.getCreate(req, res));
serviceRouter.post('/create', (req, res) => ServiceController.createService(req, res));
serviceRouter.post('/update/:id', (req, res) => ServiceController.updateService(req, res));

module.exports = serviceRouter;