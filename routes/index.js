const router = require('express').Router();
const authroutes = require('./auth.routes');
const imageroutes = require('./image.routes');

router.use('/auth' , authroutes);
router.use('/image', imageroutes);

router.get('/',  (req, res) => {
    res.send("Welcome to my vps api DA-KTHDV");
})
module.exports = router;