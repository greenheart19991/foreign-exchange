const Joi = require('@hapi/joi');

const getSchema = {
    params: Joi.object({
        id: Joi.number()
            .integer()
            .min(0)
            .required()
    })
};

module.exports = {
    getSchema
};
