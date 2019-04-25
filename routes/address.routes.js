var express = require('express')
var addressRouter = express.Router();
const AddressController = require('../controllers/address.controller');

addressRouter.get('/', (req, res) => AddressController.getAllAddress(req, res));
addressRouter.get('/detail', (req, res) => AddressController.getDetailAddress(req, res));
addressRouter.post('/test', (req, res) => AddressController.test(req, res));

module.exports = addressRouter;