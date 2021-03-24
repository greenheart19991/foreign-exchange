const { promisify } = require('util');
const redis = require('../../../../config/redis');
const { getRedisKey } = require('../../../helpers/redis');
const {
    REDIS_SESSIONS_NS_PREFIX,
    REDIS_SESSIONS_USER_ID_INDEX_NS_PREFIX,
    REDIS_SESSIONS_TRACKER_KEY
} = require('../../../constants/redis');

const hget = promisify(redis.hget).bind(redis);

const deleteSessionOperation = async (id) => {
    const sKey = getRedisKey(id, REDIS_SESSIONS_NS_PREFIX);
    const userIdStr = await hget(sKey, 'userId');

    if (userIdStr === null) {
        return null;
    }

    const sUserIdIndexKey = getRedisKey(userIdStr, REDIS_SESSIONS_USER_ID_INDEX_NS_PREFIX);

    return new Promise((resolve, reject) => {
        redis
            .multi()
            .del(sKey)
            .srem(sUserIdIndexKey, id)
            .zrem(REDIS_SESSIONS_TRACKER_KEY, id)
            .exec((err, results) => (
                err
                    ? reject(err)
                    : resolve(results)
            ));
    });
};

module.exports = deleteSessionOperation;
