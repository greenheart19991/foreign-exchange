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

const idSchema = Joi.number()
    .integer()
    .min(0)
    .required();

const userSchema = Joi.object({
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
});

const listSchema = {
    query: Joi.object({
        ...filterSchema,
        ...sortSchema,
        ...paginationSchema
    })
};

const getSchema = {
    params: Joi.object({
        id: idSchema
    })
};

const createSchema = {
    body: userSchema
};

const patchSchema = {
    params: Joi.object({
        id: idSchema
    }),
    body: userSchema
        .fork(
            ['firstName', 'lastName', 'email', 'password', 'role', 'isActive'],
            (schema) => schema.optional()
        )
        .min(1)
};

module.exports = {
    listSchema,
    getSchema,
    createSchema,
    patchSchema
};
