var express = require('express')
var serviceRouter = express.Router();
const ServiceController = require('../controllers/service.controller');
const ServiceMiddleware = require('../middlewares/service.middleware');
const { accessToken } = require('../middlewares/auth.middleware');

/**
 * Middlewares
 */
serviceRouter.post('/create', (req, res, next) => ServiceMiddleware.createService(req, res, next));
serviceRouter.post('/:id/update', (req, res, next) => ServiceMiddleware.updateService(req, res, next));  // id == service_id


/**
 * Controllers
 */
serviceRouter.get('/types/list', (req, res) => ServiceController.getListServiceType(req, res)); // get service types list
serviceRouter.get('/:id', (req, res) => ServiceController.getList(req, res)); // get services list by id == account_id
serviceRouter.get('/:id/edit', (req, res) => ServiceController.getEdit(req, res)); // id == service_id
serviceRouter.get('/create', (req, res) => ServiceController.getCreate(req, res));
serviceRouter.post('/create', accessToken, (req, res) => ServiceController.createService(req, res));
serviceRouter.patch('/:id/update', accessToken, (req, res) => ServiceController.updateService(req, res));  // id == service_id
serviceRouter.delete('/:id/delete', accessToken, (req, res) => ServiceController.deleteService(req, res));  // id == service_id
serviceRouter.get('/types/provider', (req, res) => ServiceController.getProviderByType(req, res));

module.exports = serviceRouter;