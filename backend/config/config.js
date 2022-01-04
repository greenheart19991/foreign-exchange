const path = require('path');
const ms = require('ms');
const Joi = require('@hapi/joi');
const dotenv = require('dotenv');

const dotenvResult = dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

if (dotenvResult.error) {
    throw dotenvResult.error;
}

const msValueValidateFn = (v, helpers) => {
    if (ms(v) === undefined) {
        helpers.error('any.invalid');
    }

    return v;
};

const schema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production')
        .default('development'),
    PORT: Joi.number()
        .port()
        .default(3000),

    PG_PORT: Joi.number()
        .port()
        .default(5432),
    PG_HOST: Joi.string()
        .hostname()
        .default('localhost'),

    PG_DB: Joi.string()
        .required(),
    PG_USER: Joi.string()
        .required(),
    PG_PASSWORD: Joi.string()
        .required(),

    REDIS_PORT: Joi.number()
        .port()
        .default(6379),
    REDIS_HOST: Joi.string()
        .hostname()
        .default('localhost'),
    REDIS_PASSWORD: Joi.string()
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
        .default('info'),

    SESSION_REFRESH_INTERVAL: Joi.string()
        .custom(msValueValidateFn)
        .required(),
    SESSION_EXPIRES_IN: Joi.string()
        .custom(msValueValidateFn)
        .required(),

    BCRYPT_SALT_ROUNDS: Joi.number()
        .integer()
        .positive()
        .required(),

    SECURE_COOKIE: Joi.bool()
        .default(false),

    TRUST_PROXY: [
        Joi.bool()
            .required()
            .default(false),
        Joi.number()
            .required(),
        Joi.string()
            .required()
    ],

    CLEAN_JOB_PATTERN: Joi.string()
        .required(),
    CLEAN_JOB_BUNCH_SIZE: Joi.number()
        .integer()
        .positive()
        .required(),
    CLEAN_JOB_INTERVAL: Joi.string()
        .custom(msValueValidateFn)
        .required()
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
    redis: {
        port: envVars.REDIS_PORT,
        host: envVars.REDIS_HOST,
        password: envVars.REDIS_PASSWORD
    },
    logging: {
        modules: {
            db: envVars.DB_ENABLE_LOGGING,
            http: envVars.HTTP_ENABLE_LOGGING
        },
        level: envVars.LOG_LEVEL
    },
    session: {
        refreshInterval: ms(envVars.SESSION_REFRESH_INTERVAL),
        expiresIn: ms(envVars.SESSION_EXPIRES_IN)
    },
    bcrypt: {
        saltRounds: envVars.BCRYPT_SALT_ROUNDS
    },
    cookie: {
        secure: envVars.SECURE_COOKIE
    },
    trustProxy: envVars.TRUST_PROXY,

    jobs: {
        cleanSessions: {
            pattern: envVars.CLEAN_JOB_PATTERN,
            bunchSize: envVars.CLEAN_JOB_BUNCH_SIZE,
            interval: ms(envVars.CLEAN_JOB_INTERVAL)
        }
    }
};
