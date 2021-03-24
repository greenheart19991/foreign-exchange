const redis = require('../../../../config/redis');
const config = require('../../../../config/config');
const sessionIDService = require('../../../services/UIDSessionIDService');
const { getRedisKey } = require('../../../helpers/redis');
const {
    REDIS_SESSIONS_NS_PREFIX,
    REDIS_SESSIONS_USER_ID_INDEX_NS_PREFIX,
    REDIS_SESSIONS_TRACKER_KEY
} = require('../../../constants/redis');

const createSessionOperation = async (userId) => {
    const id = await sessionIDService.generate();

    const nowMs = Date.now();
    const blocksAtMs = nowMs + config.session.refreshInterval;
    const expiresAtMs = nowMs + config.session.expiresIn;

    const sKey = getRedisKey(id, REDIS_SESSIONS_NS_PREFIX);
    const sUserIdIndexKey = getRedisKey(userId, REDIS_SESSIONS_USER_ID_INDEX_NS_PREFIX);

    await new Promise((resolve, reject) => {
        redis
            .multi()
            .hset(
                sKey,
                'userId', userId,
                'blocksAt', blocksAtMs,
                'expiresAt', expiresAtMs
            )
            .sadd(sUserIdIndexKey, id)
            .zadd(REDIS_SESSIONS_TRACKER_KEY, expiresAtMs, id)
            .exec((err, results) => (
                err
                    ? reject(err)
                    : resolve(results)
            ));
    });

    return {
        id,
        userId,
        blocksAt: new Date(blocksAtMs),
        expiresAt: new Date(expiresAtMs)
    };
};

module.exports = createSessionOperation;
