const router = require('express').Router();
const { required, exist } = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {
    //LETS VALIDATE THE DATA BEFORE WE MAKE A USER
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //CHECKING IF USER IS ALREADY IN DATABASE
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exist, use another email to register');

    //HASH PASSWORDS
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //CREATE A NEW USER
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        const savedUSer = await user.save();
        res.send({ user: savedUSer._id });
    } catch (error) {
        res.status(400).send(error);
    }

});

router.post('/login', async (req, res) => {

    //LETS VALIDATE THE DATA BEFORE WE MAKE A USER
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //CHECKING IF USER EMAIL IS ALREADY IN DATABASE OR NOT REGISTERED
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not found');

    //PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    //CREATE AND ASSIGN A TOKEN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);

    // res.header('auth-token', token).send(token);
    res.header('auth-token', token).send(`Welcome ${user.name}, Logged in!`);
});

module.exports = router;