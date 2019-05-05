var express = require('express')
var providerRouter = express.Router()
const { accessToken } = require('../middlewares/auth.middleware');
const ProviderMiddleware = require('../middlewares/provider.middleware')
const ProviderController = require('../controllers/provider.controller')

//find near by, without filter
providerRouter.get('/near/', accessToken, (req, res, next) => ProviderMiddleware.nearBy(req, res, next));
providerRouter.get('/near/', accessToken, (req, res) => ProviderController.near(req, res));

module.exports = userRouter