const Joi = require('@hapi/joi');

const getSchema = {
    query: Joi.object({
        userId: Joi.number()
            .integer()
            .required()
    })
};

module.exports = {
    getSchema
};
