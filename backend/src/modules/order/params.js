const Joi = require('@hapi/joi');
const {
    createFilterSchema,
    createSortSchema,
    paginationSchema
} = require('../../helpers/params');

const filterAllowedFields = [
    'id',
    'userId',
    'timestamp',
    '$Subscription.id$',
    '$Subscription.name$',
    '$Subscription.period_type$',
    '$Subscription.periods$',
    '$Subscription.price$',
    '$Subscription.requests$',
    '$Subscription.start_timestamp$',
    '$Subscription.end_timestamp$'
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

const createSchema = {
    body: Joi.object({
        userId: Joi.number()
            .integer()
            .required(),
        subscriptionId: Joi.number()
            .integer()
            .required()
    })
};

module.exports = {
    listSchema,
    createSchema
};
