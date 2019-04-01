const router = require('express').Router();
const authroutes = require('./auth.routes');

router.use('/auth' , authroutes);
router.get('/',  (req, res) => {
    res.send("Welcome to my vps api DA-KTHDV");
})
module.exports = router;