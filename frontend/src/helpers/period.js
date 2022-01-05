import { MAX_MS_PER_31_DAY, MAX_MS_PER_366_DAY } from '../consts/periods';
import { PERIOD_TYPE_MONTH, PERIOD_TYPE_YEAR } from '../consts/periodTypes';

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

const getPeriodsCount = (startTimestamp, endTimestamp, periodType) => {
    const startTimestampMs = startTimestamp.getTime();
    const endTimestampMs = endTimestamp.getTime();

    if (startTimestampMs > endTimestampMs) {
        throw new Error('Start timestamp cannot be bigger than end timestamp');
    }

    const diffMs = startTimestampMs - endTimestampMs;
    const maxPeriodDurationMs = getMaxPeriodDurationMs(periodType);

    const minPeriods = Math.floor(diffMs / maxPeriodDurationMs);
    let periodEndTimestamp = addPeriods(startTimestamp, periodType, minPeriods);

    if (periodEndTimestamp.getTime() === endTimestampMs) {
        return minPeriods;
    }

    let count = minPeriods;
    let periodStartTimestamp;

    while (periodEndTimestamp < endTimestamp) {
        periodStartTimestamp = periodEndTimestamp;
        periodEndTimestamp = addPeriods(periodEndTimestamp, periodType, 1);
        count += 1;
    }

    if (periodEndTimestamp > endTimestamp) {
        count -= 1;

        const periodStartTimestampMs = periodStartTimestamp.getTime();
        const periodEndTimestampMs = periodEndTimestamp.getTime();

        const periodDurationMs = periodEndTimestampMs - periodStartTimestampMs;

        count += (endTimestampMs - periodStartTimestampMs) / periodDurationMs;
    }

    return count;
};

const getPeriodBoundaries = (pointTimestamp, startTimestamp, periodType) => {
    if (pointTimestamp < startTimestamp) {
        throw new Error('Point timestamp is out of range');
    }

    const pointTimestampMs = pointTimestamp.getTime();
    const startTimestampMs = startTimestamp.getTime();

    const diffMs = startTimestampMs - pointTimestampMs;
    const maxPeriodDurationMs = getMaxPeriodDurationMs(periodType);

    const minPeriods = Math.floor(diffMs / maxPeriodDurationMs);

    let periodEndTimestamp = addPeriods(startTimestamp, periodType, minPeriods + 1);
    while (pointTimestamp > periodEndTimestamp) {
        periodEndTimestamp = addPeriods(periodEndTimestamp, periodType, 1);
    }

    const periodStartTimestamp = addPeriods(periodEndTimestamp, periodType, -1);

    return {
        startTimestamp: periodStartTimestamp,
        endTimestamp: periodEndTimestamp
    };
};

// eslint-disable-next-line arrow-body-style
const getSubscriptionEndTimestamp = (subscriptionStartTimestamp, periodType, periods) => {
    return addPeriods(subscriptionStartTimestamp, periodType, periods);
};

export {
    addPeriods,
    getPeriodsCount,
    getPeriodBoundaries,
    getSubscriptionEndTimestamp
};
