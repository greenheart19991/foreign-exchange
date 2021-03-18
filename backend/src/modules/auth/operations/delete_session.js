const { promisify } = require('util');
const redis = require('../../../../config/redis');

const del = promisify(redis.del).bind(redis);

const deleteSessionOperation = async (id) => del(id);

module.exports = deleteSessionOperation;
