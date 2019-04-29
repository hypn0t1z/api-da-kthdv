const router = require('express').Router();
const authroutes = require('./auth.routes');
const imageroutes = require('./image.routes');
const userroutes = require('./users.routes');
const addressroutes = require('./address.routes');
const serviceroutes = require('./service.routes');
const { accessToken } = require('../middlewares/auth.middleware');

router.use('/auth' , authroutes);
router.use('/image', imageroutes);
router.use('/user', accessToken, userroutes);
router.use('/address', addressroutes);
router.use('/service', accessToken, serviceroutes);

router.get('/',  (req, res) => {
    res.send("Welcome to my vps api DA-KTHDV");
});
module.exports = router;