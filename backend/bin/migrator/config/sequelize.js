const Sequelize = require('sequelize');
const config = require('./config');

// TODO: setup ssl

const options = {
    dialect: 'postgres',
    port: config.pg.port,
    host: config.pg.host,
    logging: (message) => console.info(message),
    benchmark: false
};

const sequelize = new Sequelize(
    config.pg.db,
    config.pg.user,
    config.pg.password,
    options
);

module.exports = sequelize;
