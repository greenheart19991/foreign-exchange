const path = require('path');
const Umzug = require('umzug');
const config = require('./config');
const sequelize = require('./sequelize');

const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
        sequelize
    },
    migrations: {
        params: [
            sequelize.getQueryInterface(),
            sequelize.constructor
        ],
        path: path.resolve(__dirname, '../../../migrations', config.env),
        pattern: /\.js$/
    }
});

module.exports = {
    umzug,
    sequelize
};
