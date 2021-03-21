const Joi = require('../../../config/joi');

const credentialsSchema = {
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(6)
        .max(31)
        .required()
};

const loginSchema = {
    body: Joi.object(credentialsSchema)
};

const logoutSchema = {
    body: Joi.object({})
};

const signupSchema = {
    body: Joi.object({
        ...credentialsSchema,
        firstName: Joi.string()
            .required(),
        lastName: Joi.string()
            .required()
    })
};

module.exports = {
    loginSchema,
    logoutSchema,
    signupSchema
};
