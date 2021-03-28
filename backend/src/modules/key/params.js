const Joi = require('@hapi/joi');

const userIdSchema = Joi.number()
    .integer()
    .required();

const getSchema = {
    params: Joi.object({
        userId: userIdSchema
    })
};

const createSchema = {
    body: Joi.object({
        userId: userIdSchema
    })
};

const removeSchema = {
    params: Joi.object({
        userId: userIdSchema
    })
};

module.exports = {
    getSchema,
    createSchema,
    removeSchema
};
