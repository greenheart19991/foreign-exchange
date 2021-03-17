const redis = require('../../../../config/redis');
const config = require('../../../../config/config');
const sessionIDService = require('../../../services/UIDSessionIDService');

const createSessionOperation = async (user) => {
    const id = await sessionIDService.generate();
    const userId = user.id;

    const nowMs = Date.now();
    const blocksAtMs = nowMs + config.session.refreshInterval;
    const expiresAtMs = nowMs + config.session.expiresIn;

    await new Promise((resolve, reject) => {
        redis
            .multi()
            .hmset(id, 'userId', String(user.id), 'blocksAt', String(blocksAtMs))
            .pexpireat(id, expiresAtMs)
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
        expiresAt: new Date(blocksAtMs)
    };
};

module.exports = createSessionOperation;
