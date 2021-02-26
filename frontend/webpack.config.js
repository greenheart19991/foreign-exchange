const { merge } = require('webpack-merge');
const common = require('./webpack/webpack.common');

const config = require(`./webpack/webpack.${process.env.NODE_ENV}`);

module.exports = merge(common, config);
