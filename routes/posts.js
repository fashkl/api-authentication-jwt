const router = require('express').Router();
const verify = require('../middleware/verifyToken');
const User = require('../model/User');

router.get('/', verify, async (req, res) => {
    console.log(await User.findOne({ _id: req.user._id }));
    res.send(req.user);
});


module.exports = router;
