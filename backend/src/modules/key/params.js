const Joi = require('@hapi/joi');

const userIdSchema = Joi.number()
    .integer()
    .required();

const getSchema = {
    query: Joi.object({
        userId: userIdSchema
    })
};

const createSchema = {
    body: Joi.object({
        userId: userIdSchema
    })
};

module.exports = {
    getSchema,
    createSchema
};
