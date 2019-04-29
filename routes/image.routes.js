var express = require('express')
const imageRouter = express.Router();
const ImageController = require('../controllers/image.controller');
const { accessToken } = require('../middlewares/auth.middleware');

imageRouter.get('/', (req, res) => ImageController.getImage(req, res));
imageRouter.post('/encode64', (req, res) => ImageController.encodeBase64(req, res));
imageRouter.post('/upload-image', accessToken, (req, res) => ImageController.uploadImage(req, res));

module.exports = imageRouter;