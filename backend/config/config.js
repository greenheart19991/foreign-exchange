const path = require('path');
const Joi = require('@hapi/joi');
const dotenv = require('dotenv');

const dotenvResult = dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

if (dotenvResult.error) {
    throw dotenvResult.error;
}

const schema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production')
        .default('development'),
    PORT: Joi.number()
        .default(3000),

    PG_PORT: Joi.number()
        .default(5432),
    PG_HOST: Joi.string()
        .default('localhost'),

    PG_DB: Joi.string()
        .required(),
    PG_USER: Joi.string()
        .required(),
    PG_PASSWORD: Joi.string()
        .required(),

    DB_ENABLE_LOGGING: Joi.bool()
        .default(true),
    HTTP_ENABLE_LOGGING: Joi.bool()
        .default(true),

    LOG_LEVEL: Joi.string()
        .valid(
            'silent',
            'fatal',
            'error',
            'warn',
            'http',
            'info',
            'debug',
            'trace'
        )
        .default('info')
}).unknown();

const { error, value: envVars } = schema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    pg: {
        port: envVars.PG_PORT,
        host: envVars.PG_HOST,
        db: envVars.PG_DB,
        user: envVars.PG_USER,
        password: envVars.PG_PASSWORD
    },
    logging: {
        modules: {
            db: envVars.DB_ENABLE_LOGGING,
            http: envVars.HTTP_ENABLE_LOGGING
        },
        level: envVars.LOG_LEVEL
    }
};
