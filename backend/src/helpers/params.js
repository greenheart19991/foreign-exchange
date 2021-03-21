const Joi = require('../../config/joi');
const { CRUD_READ_DEFAULT_MAX_LIMIT } = require('../constants/crud');

const createFilterSchema = (fields) => {
    const schema = fields.reduce((acc, k) => {
        acc[k] = Joi.any();
        return acc;
    }, {});

    return {
        where: Joi.object(schema)
            .messages({
                'string.json': 'Invalid JSON provided for filter statement',
                'object.base': 'Filter statement must represent an object'
            })
    };
};

const createSortSchema = (fields) => ({
    sort: Joi.array()
        .items(
            Joi.array().ordered(
                Joi.string()
                    .valid(...fields)
                    .required(),
                Joi.string()
                    .valid('asc', 'desc')
                    .required()
            )
        )
        .min(1)
        .unique((a, b) => a[0] === b[0])
});

const paginationSchema = {
    offset: Joi.number()
        .integer()
        .min(0),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(CRUD_READ_DEFAULT_MAX_LIMIT)
};

module.exports = {
    createFilterSchema,
    createSortSchema,
    paginationSchema
};
