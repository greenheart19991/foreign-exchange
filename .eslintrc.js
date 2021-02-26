const rules = require('./misc/eslint/overrides/airbnb');

module.exports = {
    root: true,
    env: {
        es6: true
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    extends: [
        'airbnb-base'
    ],
    rules
};
