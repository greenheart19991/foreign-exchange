const Joi = require('@hapi/joi');
const { PERIOD_TYPE_MONTH, PERIOD_TYPE_YEAR } = require('../../constants/period_types');
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

const createSchema = {
    body: Joi.object({
        name: Joi.string()
            .required(),
        periodType: Joi.string()
            .valid(PERIOD_TYPE_MONTH, PERIOD_TYPE_YEAR)
            .required(),
        periods: Joi.number()
            .integer()
            .positive()
            .required(),
        price: Joi.number()
            .min(0)
            .required(),
        requests: Joi.number()
            .integer()
            .positive()
            .required(),
        startTimestamp: Joi.date()
            .timestamp(),
        endTimestamp: Joi.date()
            .timestamp()
            .allow(null)
    })
};

const archiveSchema = {
    params: Joi.object({
        id: idSchema
    })
};

module.exports = {
    listSchema,
    getSchema,
    createSchema,
    archiveSchema
};
