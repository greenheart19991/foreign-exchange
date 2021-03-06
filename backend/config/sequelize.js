const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const config = require('./config');
const logger = require('./logger');

const operatorsAliases = {
    $eq: Op.eq,
    $ne: Op.ne,
    $gte: Op.gte,
    $gt: Op.gt,
    $lte: Op.lte,
    $lt: Op.lt,
    $not: Op.not,
    $in: Op.in,
    $notIn: Op.notIn,
    $is: Op.is,
    $like: Op.like,
    $notLike: Op.notLike,
    $iLike: Op.iLike,
    $notILike: Op.notILike,
    $regexp: Op.regexp,
    $notRegexp: Op.notRegexp,
    $iRegexp: Op.iRegexp,
    $notIRegexp: Op.notIRegexp,
    $between: Op.between,
    $notBetween: Op.notBetween,
    $overlap: Op.overlap,
    $contains: Op.contains,
    $contained: Op.contained,
    $adjacent: Op.adjacent,
    $strictLeft: Op.strictLeft,
    $strictRight: Op.strictRight,
    $noExtendRight: Op.noExtendRight,
    $noExtendLeft: Op.noExtendLeft,
    $and: Op.and,
    $or: Op.or,
    $any: Op.any,
    $all: Op.all,
    $values: Op.values,
    $col: Op.col
};

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
    benchmark: config.logging.modules.db,
    operatorsAliases
};

const sequelize = new Sequelize(
    config.pg.db,
    config.pg.user,
    config.pg.password,
    options
);

module.exports = sequelize;
