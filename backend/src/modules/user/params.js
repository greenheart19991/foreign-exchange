const Joi = require('@hapi/joi');
const { ROLE_USER, ROLE_ADMIN } = require('../../constants/roles');
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

const createSchema = {
    body: Joi.object({
        firstName: Joi.string()
            .required(),
        lastName: Joi.string()
            .required(),
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .max(31)
            .required(),
        role: Joi.string()
            .valid(ROLE_USER, ROLE_ADMIN)
            .required(),
        isActive: Joi.boolean()
            .required()
    })
};

module.exports = {
    listSchema,
    getSchema,
    createSchema
};
