const { MAX_MS_PER_31_DAY, MAX_MS_PER_366_DAY } = require('../constants/periods');
const { PERIOD_TYPE_MONTH, PERIOD_TYPE_YEAR } = require('../constants/period_types');

const getMaxPeriodDurationMs = (periodType) => {
    switch (periodType) {
        case PERIOD_TYPE_MONTH:
            return MAX_MS_PER_31_DAY;
        case PERIOD_TYPE_YEAR:
            return MAX_MS_PER_366_DAY;
        default:
            throw new Error(`Period type '${periodType}' is not supported`);
    }
};

const addPeriods = (timestamp, periodType, periods) => {
    const res = new Date(timestamp);

    switch (periodType) {
        case PERIOD_TYPE_MONTH:
            res.setMonth(timestamp.getMonth() + periods);
            break;
        case PERIOD_TYPE_YEAR:
            res.setFullYear(timestamp.getFullYear() + periods);
            break;
        default:
            throw new Error(`Period type '${periodType}' is not supported`);
    }

    return res;
};

// eslint-disable-next-line arrow-body-style
const getSubscriptionEndTimestamp = (startTimestamp, periodType, periods) => {
    return addPeriods(startTimestamp, periodType, periods);
};

const getPeriodBoundaries = (pointTimestamp, subscriptionStartTimestamp, periodType) => {
    if (pointTimestamp < subscriptionStartTimestamp) {
        throw new Error('Point timestamp is out of range');
    }

    const pointTimestampMs = pointTimestamp.getTime();
    const subStartTimestampMs = subscriptionStartTimestamp.getTime();

    const diffMs = subStartTimestampMs - pointTimestampMs;
    const maxPeriodDurationMs = getMaxPeriodDurationMs(periodType);

    const minPeriods = Math.floor(diffMs / maxPeriodDurationMs);

    let endTimestamp = addPeriods(subscriptionStartTimestamp, periodType, minPeriods + 1);
    while (pointTimestamp > endTimestamp) {
        endTimestamp = addPeriods(endTimestamp, periodType, 1);
    }

    const startTimestamp = addPeriods(endTimestamp, periodType, -1);

    return {
        startTimestamp,
        endTimestamp
    };
};

module.exports = {
    getSubscriptionEndTimestamp,
    getPeriodBoundaries
};
