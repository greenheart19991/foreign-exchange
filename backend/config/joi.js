const Joi = require('@hapi/joi');

const coerceFromJsonConfig = {
    messages: {
        'string.json': 'if {{#label}} is string, it must be in JSON format'
    },
    coerce: {
        from: 'string',
        method(str, helpers) {
            let res;
            try {
                res = { value: JSON.parse(str) };
            } catch (err) {
                res = { errors: helpers.error('string.json') };
            }

            return res;
        }
    }
};

const extended = Joi
    .extend({
        type: 'object',
        base: Joi.object(),
        ...coerceFromJsonConfig
    })
    .extend({
        type: 'array',
        base: Joi.array(),
        ...coerceFromJsonConfig
    });

module.exports = extended;
