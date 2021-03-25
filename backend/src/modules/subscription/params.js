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

const listSchema = {
    query: Joi.object({
        ...filterSchema,
        ...sortSchema,
        ...paginationSchema,
        unpublished: Joi.boolean()
            .required()
    })
};

module.exports = {
    listSchema
};
