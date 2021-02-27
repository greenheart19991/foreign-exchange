const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const paths = require('./paths');

const globalStylesRegex = /\.(sa|sc|c)ss$/;
const moduleStylesRegex = /\.module\.(sa|sc|c)ss$/;

const getStyleLoaders = (cssLoaderOptions) => ([
    'style-loader',
    {
        loader: 'css-loader',
        options: {
            sourceMap: true,
            ...cssLoaderOptions
        }
    },
    { loader: 'postcss-loader', options: { sourceMap: true } },
    { loader: 'resolve-url-loader', options: { sourceMap: true } },
    { loader: 'sass-loader', options: { sourceMap: true } }
]);

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    output: {
        publicPath: paths.dev.output.publicPath,
        filename: '[name].js'
    },
    devServer: {
        hot: true,
        historyApiFallback: true,
        publicPath: paths.dev.output.publicPath,
        port: 3001,
        proxy: {
            '/api': 'http://localhost:3000'
        }
    },
    module: {
        rules: [
            {
                test: moduleStylesRegex,
                use: getStyleLoaders({
                    modules: {
                        localIdentContext: './src',
                        localIdentName: '[path][name]__[local]',
                        exportLocalsConvention: 'dashes'
                    }
                }),
                sideEffects: false
            },
            {
                test: globalStylesRegex,
                exclude: moduleStylesRegex,
                use: getStyleLoaders({
                    modules: false
                })
            }
        ]
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlPlugin({
            title: 'Foreign Exchange',
            favicon: './public/favicon.ico',
            template: './public/index.html'
        })
    ],
    optimization: {
        noEmitOnErrors: true
    }
};
