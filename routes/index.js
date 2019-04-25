const router = require('express').Router();
const authroutes = require('./auth.routes');
const imageroutes = require('./image.routes');
const userroutes = require('./users.routes');
const addressroutes = require('./address.routes');
const serviceroutes = require('./service.routes');

router.use('/auth' , authroutes);
router.use('/image', imageroutes);
router.use('/user' , userroutes);
router.use('/address', addressroutes);
//router.use('/service', serviceroutes);

router.get('/',  (req, res) => {
    res.send("Welcome to my vps api DA-KTHDV");
});
module.exports = router;