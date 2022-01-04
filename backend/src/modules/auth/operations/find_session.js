const { promisify } = require('util');
const redis = require('../../../../config/redis');
const { getRedisKey } = require('../../../helpers/redis');
const { REDIS_SESSIONS_NS_PREFIX } = require('../../../constants/redis');

const hmget = promisify(redis.hmget).bind(redis);

const findSessionOperation = async (id) => {
    const key = getRedisKey(id, REDIS_SESSIONS_NS_PREFIX);
    const [userIdStr, blocksAtMsStr, expiresAtMsStr] = await hmget(key, 'userId', 'blocksAt', 'expiresAt');

    if (userIdStr === null) {
        return null;
    }

    const userId = parseInt(userIdStr, 10);
    const blocksAtMs = parseInt(blocksAtMsStr, 10);
    const expiresAtMs = parseInt(expiresAtMsStr, 10);

    return {
        id,
        userId,
        blocksAt: new Date(blocksAtMs),
        expiresAt: new Date(expiresAtMs)
    };
};

module.exports = findSessionOperation;
