const Joi = require('@hapi/joi');

const credentialsSchema = {
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(3)
        .max(31)
        .required()
};

const loginSchema = {
    body: Joi.object(credentialsSchema)
};

module.exports = {
    loginSchema
};
