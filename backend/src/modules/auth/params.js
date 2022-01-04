const Joi = require('../../../config/joi');

const credentialsSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(6)
        .max(31)
        .required()
});

const loginSchema = {
    body: credentialsSchema
};

const signupSchema = {
    body: credentialsSchema.append({
        firstName: Joi.string()
            .required(),
        lastName: Joi.string()
            .required()
    })
};

module.exports = {
    loginSchema,
    signupSchema
};
