const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const paths = require('./paths');

const globalStylesRegex = /\.(sa|sc|c)ss$/;
const moduleStylesRegex = /\.module\.(sa|sc|c)ss$/;

const getStyleLoaders = (cssLoaderOptions) => ([
    MiniCssExtractPlugin.loader,
    {
        loader: 'css-loader',
        options: cssLoaderOptions
    },
    'postcss-loader',
    'sass-loader'
]);

// TODO: add minifying css class names
// TODO: enable cache and multi-process build (ex. for minifiers)

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    output: {
        path: paths.prod.output.distPath,
        publicPath: paths.prod.output.publicPath,
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].chunk.js'
    },
    module: {
        rules: [
            {
                test: moduleStylesRegex,
                use: getStyleLoaders({
                    modules: {
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
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    output: {
                        comments: false
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    discardComments: {
                        removeAll: true
                    }
                }
            })
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'disabled',
            generateStatsFile: true
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[name].[contenthash].chunk.css'
        }),
        new CompressionPlugin(),
        new HtmlPlugin({
            title: 'Foreign Exchange',
            favicon: './public/favicon.ico',
            template: './public/index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        })
    ]
};
