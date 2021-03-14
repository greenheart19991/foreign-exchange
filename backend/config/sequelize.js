const Sequelize = require('sequelize');
const config = require('./config');
const logger = require('./logger');

// TODO: setup ssl

const options = {
    dialect: 'postgres',
    port: config.pg.port,
    host: config.pg.host,
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
        acquire: 30000
    },
    logging: config.logging.modules.db
        && ((message, ms) => logger.info(`${message}\nTime: ${ms}ms`)),
    benchmark: config.logging.modules.db
};

const sequelize = new Sequelize(
    config.pg.db,
    config.pg.user,
    config.pg.password,
    options
);

module.exports = sequelize;
