const { promisify } = require('util');
const cron = require('node-cron');
const redis = require('../../config/redis');
const logger = require('../../config/logger');
const Job = require('./base_job');
const { getRedisKey } = require('../helpers/redis');
const {
    REDIS_SESSIONS_NS_PREFIX,
    REDIS_SESSIONS_USER_ID_INDEX_NS_PREFIX,
    REDIS_SESSIONS_TRACKER_KEY
} = require('../constants/redis');

const hget = promisify(redis.hget).bind(redis);
const zrangebyscore = promisify(redis.zrangebyscore).bind(redis);

class CleanSessionsJob extends Job {
    constructor(pattern, reqBunchSize, interval) {
        super();

        this.pattern = pattern;
        this.reqBunchSize = reqBunchSize;
        this.interval = interval;

        this._getOpBunchSize = this.reqBunchSize;

        this._reqPerDelete = 5;
        this._deleteOpBunchSize = Math.floor(this.reqBunchSize / this._reqPerDelete);

        this._task = null;
    }

    setup() {
        if (this._task) {
            throw new Error('Sessions cleaning is already scheduled');
        }

        this._task = cron.schedule(this.pattern, this._clean.bind(this));
        logger.info('Sessions cleaning scheduled');
    }

    destroy() {
        if (!this._task) {
            throw new Error('Sessions cleaning has not been scheduled yet');
        }

        this._task.destroy();
        this._task = null;

        logger.info('Sessions cleaning destroyed');
    }

    async _clean() {
        logger.info('Sessions cleaning started');

        const nowMs = Date.now();

        const sessionsIds = await zrangebyscore(REDIS_SESSIONS_TRACKER_KEY, '-inf', `(${nowMs}`);
        const iterations = Math.ceil(sessionsIds.length / this._getOpBunchSize);

        logger.trace(
            `Sessions to delete: ${sessionsIds.length}\n`
            + `reqBunchSize: ${this.reqBunchSize}\n`
            + `get iterations: ${iterations}`
        );

        /* eslint-disable no-await-in-loop */

        for (let i = 0; i < iterations; i += 1) {
            const sliceStartIdx = i * this._getOpBunchSize;
            const sliceEndIdx = (i === iterations - 1)
                ? sessionsIds.length
                : sliceStartIdx + this._getOpBunchSize;

            logger.trace(
                'Retrieving user ids...\n'
                + `slice size: ${sliceEndIdx - sliceStartIdx}\n`
                + `(from ${sliceStartIdx} to ${sliceEndIdx})`
            );

            // retrieve user ids

            const getUserIdPromises = sessionsIds
                .slice(sliceStartIdx, sliceEndIdx)
                .map((id) => {
                    const key = getRedisKey(id, REDIS_SESSIONS_NS_PREFIX);
                    return hget(key, 'userId');
                });

            const results = await Promise.allSettled(getUserIdPromises);
            const sessionUserPairs = [];

            // match user ids to session ids.
            // Save only fulfilled

            results.forEach((result, j) => {
                if (result.status === 'rejected') {
                    logger.error(result.reason);
                    return;
                }

                const userIdStr = result.value;
                const sessionId = sessionsIds[sliceStartIdx + j];

                sessionUserPairs.push([sessionId, userIdStr]);
            });

            logger.trace('Retrieving done.');

            await this._sleep(this.interval);

            // delete sessions

            const deleteIterations = Math.ceil(sessionUserPairs.length / this._deleteOpBunchSize);

            for (let j = 0; j < deleteIterations; j += 1) {
                const supSliceStartIdx = j * this._deleteOpBunchSize;
                const supSliceEndIdx = (j === deleteIterations - 1)
                    ? sessionUserPairs.length
                    : supSliceStartIdx + this._deleteOpBunchSize;

                logger.trace(
                    'Deleting sessions...\n'
                    + `slice size: ${supSliceEndIdx - supSliceStartIdx}\n`
                    + `(from ${supSliceStartIdx} to ${supSliceEndIdx} of retrieved)`
                );

                const deletePromises = sessionUserPairs
                    .slice(supSliceStartIdx, supSliceEndIdx)
                    .map(([sessionId, userIdStr]) => {
                        const sKey = getRedisKey(sessionId, REDIS_SESSIONS_NS_PREFIX);
                        const sUserIdIndexKey = getRedisKey(userIdStr, REDIS_SESSIONS_USER_ID_INDEX_NS_PREFIX);

                        return new Promise((resolve, reject) => {
                            redis
                                .multi()
                                .del(sKey)
                                .srem(sUserIdIndexKey, sessionId)
                                .zrem(REDIS_SESSIONS_TRACKER_KEY, sessionId)
                                .exec((err, res) => (
                                    err
                                        ? reject(err)
                                        : resolve(res)
                                ));
                        });
                    });

                const deleteResults = await Promise.allSettled(deletePromises);

                deleteResults.forEach((result) => {
                    if (result.status === 'rejected') {
                        logger.error(result.reason);
                    }
                });

                logger.trace('Deleting done.');

                await this._sleep(this.interval);
            }
        }

        /* eslint-enable no-await-in-loop */

        logger.info('Sessions cleaning done.');
    }

    async _sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}

// eslint-disable-next-line arrow-body-style
module.exports = (pattern, bunchSize, interval) => {
    return new CleanSessionsJob(pattern, bunchSize, interval);
};
