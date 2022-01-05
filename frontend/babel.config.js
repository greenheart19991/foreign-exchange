module.exports = {
    ignore: [
        './dist/**'
    ],
    presets: [
        [
            '@babel/env',
            {
                useBuiltIns: 'usage',
                corejs: '3.6',
                modules: false
            }
        ],
        '@babel/react'
    ],
    plugins: [
        '@babel/transform-runtime',
        [
            '@babel/proposal-decorators',
            { legacy: true }
        ],
        '@babel/proposal-class-properties',
        '@babel/proposal-export-default-from',
        '@babel/proposal-export-namespace-from'
    ]
};
