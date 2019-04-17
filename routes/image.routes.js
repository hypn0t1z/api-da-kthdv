var express = require('express')
const imageRouter = express.Router();
const ImageController = require('../controllers/image.controller');

imageRouter.get('/', (req, res) => ImageController.getImage(req, res));

module.exports = imageRouter;