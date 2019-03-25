const router = require('express').Router();
const authroutes = require('./auth.routes');

router.use('/auth' , authroutes);

module.exports = router;