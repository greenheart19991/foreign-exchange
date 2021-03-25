const Joi = require('@hapi/joi');
const {
    createFilterSchema,
    createSortSchema,
    paginationSchema
} = require('../../helpers/params');

const filterAllowedFields = [
    'id',
    'name',
    'periodType',
    'periods',
    'price',
    'requests',
    'startTimestamp',
    'endTimestamp'
];

const filterSchema = createFilterSchema(filterAllowedFields);
const sortSchema = createSortSchema(filterAllowedFields);

const idSchema = Joi.number()
    .integer()
    .min(0)
    .required();

const listSchema = {
    query: Joi.object({
        ...filterSchema,
        ...sortSchema,
        ...paginationSchema,
        unpublished: Joi.boolean()
            .required()
    })
};

const getSchema = {
    params: Joi.object({
        id: idSchema
    })
};

module.exports = {
    listSchema,
    getSchema
};
