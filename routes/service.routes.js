var express = require('express')
var serviceRouter = express.Router();
const ServiceController = require('../controllers/service.controller');
const ServiceMiddleware = require('../middlewares/service.middleware');
const { accessToken } = require('../middlewares/auth.middleware');



/**
 * Controllers
 */
serviceRouter.get('/types/list', (req, res) => ServiceController.getListServiceType(req, res)); // get service types list
serviceRouter.get('/:id', (req, res) => ServiceController.getList(req, res)); // get services list by id == account_id
serviceRouter.get('/types/provider', (req, res) => ServiceController.getProviderByType(req, res));
//serviceRouter.get('/types/:type_id', (req, res) => ServiceController.getDetailType(req, res));

module.exports = serviceRouter;