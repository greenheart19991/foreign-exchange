const { promisify } = require('util');
const redis = require('../../../../config/redis');
const { User, Key } = require('../../../models');
const OperationError = require('../../../errors/operation_error');
const { USER_ERROR_USER_NOT_FOUND } = require('../constants/error_codes');
const { getRedisKey } = require('../../../helpers/redis');
const {
    REDIS_SESSIONS_NS_PREFIX,
    REDIS_SESSIONS_USER_ID_INDEX_NS_PREFIX,
    REDIS_SESSIONS_TRACKER_KEY
} = require('../../../constants/redis');

const smembers = promisify(redis.smembers).bind(redis);

const deleteUserOperation = async (id) => {
    const user = await User.findByPk(id, {
        attributes: ['id']
    });

    if (!user) {
        const error = new OperationError(USER_ERROR_USER_NOT_FOUND, 'User not found');
        return { error };
    }

    await Key.destroy({ where: { userId: user.id } });
    await user.destroy();

    // delete sessions

    const sUserIdIndexKey = getRedisKey(id, REDIS_SESSIONS_USER_ID_INDEX_NS_PREFIX);
    const sessionsIds = await smembers(sUserIdIndexKey);

    const sKeys = sessionsIds.map((sessionId) => getRedisKey(sessionId, REDIS_SESSIONS_NS_PREFIX));

    if (sessionsIds.length > 0) {
        await new Promise((resolve, reject) => {
            redis
                .multi()
                .del(...sKeys)
                .del(sUserIdIndexKey)
                .zrem(REDIS_SESSIONS_TRACKER_KEY, ...sessionsIds)
                .exec((err, results) => (
                    err
                        ? reject(err)
                        : resolve(results)
                ));
        });
    }

    return { error: null };
};

module.exports = deleteUserOperation;
