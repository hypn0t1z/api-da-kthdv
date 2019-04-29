var express = require('express')
var addressRouter = express.Router();
const AddressController = require('../controllers/address.controller');
const { accessToken } = require('../middlewares/auth.middleware');

addressRouter.get('/', (req, res) => AddressController.getAllAddress(req, res));
addressRouter.get('/detail', (req, res) => AddressController.getDetailAddress(req, res));
addressRouter.get('/:id', accessToken, (req, res) => AddressController.getAddressById(req, res)); // address_id

module.exports = addressRouter;