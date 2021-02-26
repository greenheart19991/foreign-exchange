const rules = require('../misc/eslint/overrides/airbnb');

module.exports = {
    env: {
        es6: true,
        browser: true
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
        'airbnb'
    ],
    rules: {
        ...rules,
        'react/jsx-indent': [
            'error',
            4
        ],
        'react/jsx-filename-extension': [
            'error',
            {
                'extensions': [
                    '.js',
                    '.jsx'
                ]
            }
        ],
        'react/static-property-placement': [
            'error',
            'static public field'
        ],
        'react/jsx-props-no-spreading': 'off',
        'react/jsx-indent-props': [
            'error',
            4
        ],
        'react/jsx-fragments': [
            'error',
            'element'
        ],
        'jsx-quotes': [
            'error',
            'prefer-single'
        ],
    },
    overrides: [
        {
            files: [
                './webpack/**',
                './*.config.js',
            ],
            rules: {
                'import/no-extraneous-dependencies': 'off',
                'import/no-dynamic-require': 'off'
            }
        }
    ],
    parser: 'babel-eslint'
};
