const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');

// TODO: setup a dist structure

module.exports = {
    entry: {
        app: './src/index'
    },
    optimization: {
        moduleIds: 'hashed',
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: true
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    'eslint-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8182
                        }
                    }
                ],
                sideEffects: false
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ],
                sideEffects: false
            }
        ]
    },
    plugins: [
        new UnusedFilesWebpackPlugin({
            patterns: [
                './src/**/*.*'
            ]
        })
    ],
    stats: {
        modules: false,
        entrypoints: false,
        assetsSort: 'chunks'
    }
};
