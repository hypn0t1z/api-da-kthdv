const router = require('express').Router();
const authroutes = require('./auth.routes');
const imageroutes = require('./image.routes');
const userroutes = require('./user.routes');

router.use('/auth' , authroutes);
router.use('/image', imageroutes);
router.use('/user' , userroutes);

router.get('/',  (req, res) => {
    res.send("Welcome to my vps api DA-KTHDV");
});
module.exports = router;