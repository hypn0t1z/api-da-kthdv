const router = require('express').Router();
const authroutes = require('./auth.routes');
const imageroutes = require('./image.routes');

router.use('/auth' , authroutes);
router.use('/image', imageroutes);

module.exports = router;