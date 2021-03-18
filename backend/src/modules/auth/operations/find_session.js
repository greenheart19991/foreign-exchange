const { promisify } = require('util');
const redis = require('../../../../config/redis');

const hmget = promisify(redis.hmget).bind(redis);
const pttl = promisify(redis.pttl).bind(redis);

const findSessionOperation = async (id) => {
    const [userIdStr, blocksAtMsStr] = await hmget(id, 'userId', 'blocksAt');

    if (userIdStr === null) {
        return null;
    }

    const nowMs = Date.now();
    const ttlUnixTs = await pttl(id);

    const userId = parseInt(userIdStr, 10);
    const blocksAtMs = parseInt(blocksAtMsStr, 10);
    const expiresAtMs = nowMs + ttlUnixTs * 1000;

    return {
        id,
        userId,
        blocksAt: new Date(blocksAtMs),
        expiresAt: new Date(expiresAtMs)
    };
};

module.exports = findSessionOperation;
