const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../model/User');
const Token = require('../model/Token');
const { registerValidation, loginValidation, passwordResetEmailValidation, passwordResetPasswordValidation } = require('../validation');
const sendEmail = require("../utils/sendEmail");


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
    // const hashedPassword = hashingPassword(req.body.password);

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
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //CHECKING IF USER EMAIL IS ALREADY IN DATABASE OR NOT REGISTERED
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not found');

    //PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

    //CREATE AND ASSIGN A TOKEN
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    // const token = generateToken(user._id);

    // res.header('auth-token', token).send(token);
    res.header('access_token', token).send(`Welcome ${user.name}, Logged in!`);
});

router.post('/resetPassword', async (req, res) => {
    try {

        //LETS VALIDATE THE DATA BEFORE WE MAKE GENERATE THE NEW TOKEN
        const { error } = passwordResetEmailValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //CHECKING IF USER IS ALREADY IN DATABASE OR NOT REGISTERED BY EMAIL
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("user with given email doesn't exist");

        //GENRATE A NEW TOKEN AND LINK IT WITH USER AND SAVE IT IN TOKENS TABLE
        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        //PREPARE THE LINK AND SEND IT VIA EMAIL
        const link = `${process.env.BASE_URL}/resetPassword/${user._id}/${token.token}`;
        await sendEmail(user.email, "Password reset", link);

        res.send(link);
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }

});

router.post('/resetPassword/:userId/:token', async (req, res) => {
    try {
        //LETS VALIDATE THE DATA
        const { error } = passwordResetPasswordValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send("Invalid link or expired");

        //SEARCH FOR THE TOKEN WHICH IS LINKED WITH USER TO VALIDATE IT
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");

        //HASH PASSWORDS
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;


        await user.save();
        await token.delete();

        res.send("password reset sucessfully. Please login");

    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});

module.exports = router;