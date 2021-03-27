const Joi = require('@hapi/joi');
const {
    createFilterSchema,
    createSortSchema,
    paginationSchema
} = require('../../helpers/params');

const filterAllowedFields = [
    'id',
    'recipientId',
    'timestamp',
    'endTimestamp',
    '$Subscription.id$',
    '$Subscription.name$',
    '$Subscription.period_type$',
    '$Subscription.periods$',
    '$Subscription.price$',
    '$Subscription.requests$',
    '$Subscription.start_timestamp$',
    '$Subscription.end_timestamp$',
    '$Committer.id$',
    '$Committer.role$',
    '$Committer.first_name$',
    '$Committer.last_name$',
    '$Committer.email$',
    '$Committer.is_active$'
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
        recipientId: Joi.number()
            .integer()
            .required(),
        subscriptionId: Joi.number()
            .integer()
            .required(),
        endTimestamp: Joi.date()
            .timestamp()
            .allow(null)
    })
};

module.exports = {
    listSchema,
    createSchema
};
