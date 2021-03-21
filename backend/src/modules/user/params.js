const Joi = require('@hapi/joi');
const {
    createFilterSchema,
    createSortSchema,
    paginationSchema
} = require('../../helpers/params');

const filterAllowedFields = [
    'id',
    'firstName',
    'lastName',
    'email',
    'role',
    'isActive'
];

const filterSchema = createFilterSchema(filterAllowedFields);
const sortSchema = createSortSchema(filterAllowedFields);

const listSchema = {
    query: Joi.object({
        ...filterSchema,
        ...sortSchema,
        ...paginationSchema
    })
};

const getSchema = {
    params: Joi.object({
        id: Joi.number()
            .integer()
            .min(0)
            .required()
    })
};

module.exports = {
    listSchema,
    getSchema
};
