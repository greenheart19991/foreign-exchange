const path = require('path');

module.exports = {
    dev: {
        output: {
            publicPath: '/'
        }
    },
    prod: {
        output: {
            distPath: path.resolve(__dirname, '..', 'dist'),
            publicPath: '/'
        }
    }
};
