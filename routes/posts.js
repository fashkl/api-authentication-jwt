const router = require('express').Router();
const verify = require('./verifyToken');
const User = require('../model/User');

router.get('/', verify, async (req, res) => {
    console.log(await User.findOne({_id: req.user._id}));
    res.send(req.user);
    // res.json({ posts: { title: 'my first post', description: 'random data you should not access' } });
})


module.exports = router;
