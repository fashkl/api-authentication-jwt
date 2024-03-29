//VALIDATION
const Joi = require('@hapi/joi');

//Register Validation
const registerValidation = (body) => {

    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(body)
}

//Login Validation
const loginValidation = (body) => {

    const schema = Joi.object({
        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(body)
}

//PasswordReset Email Validation
const passwordResetEmailValidation = (body) => {

    const schema = Joi.object({
        email: Joi.string().min(4).required().email(),
    });

    return schema.validate(body)
}

//PasswordReset Password Validation
const passwordResetPasswordValidation = (body) => {

    const schema = Joi.object({
        password: Joi.string().min(6).required(),
    });

    return schema.validate(body)
}


// module.exports.registerValidation = registerValidation;
// module.exports.loginValidation = loginValidation;
module.exports = {
    registerValidation,
    loginValidation,
    passwordResetEmailValidation,
    passwordResetPasswordValidation,
};