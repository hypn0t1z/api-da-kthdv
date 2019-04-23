var express = require('express')
var addressRouter = express.Router();
const AddressController = require('../controllers/address.controller');

addressRouter.get('/', (req, res) => AddressController.getAllAddress(req, res));

module.exports = addressRouter;