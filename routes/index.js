const router = require('express').Router();
const authroutes = require('./auth.routes');
const imageroutes = require('./image.routes');
const userroutes = require('./users.routes');
const addressroutes = require('./address.routes');
const serviceroutes = require('./service.routes');
const UserController = require('../controllers/user.controller')
const { accessToken } = require('../middlewares/auth.middleware');

router.use('/auth' , authroutes);
router.use('/image', imageroutes);
router.use('/user', userroutes);
router.use('/address', addressroutes);
router.use('/service', serviceroutes);

router.get('/find-nearby', accessToken, (req, res) => UserController.findNearby(req, res));

router.get('/',  (req, res) => {
    res.send("Welcome to my vps api DA-KTHDV");
});
module.exports = router;