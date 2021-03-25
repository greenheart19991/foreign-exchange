const { Subscription } = require('../../../models');
const { getPlainData } = require('../../../helpers/mapper');
const OperationError = require('../../../errors/operation_error');
const {
    SUBS_ERROR_START_TS_LT_NOW,
    SUBS_ERROR_END_TS_LTE_START_TS,
    SUBS_ERROR_NAME_ALREADY_EXISTS
} = require('../constants/error_codes');

const createSubscriptionOperation = async (data) => {
    const nowMs = Date.now();
    const {
        name,
        periodType,
        periods,
        price,
        requests,
        startTimestamp: startTimestampMs = nowMs,
        endTimestamp: endTimestampMs = null
    } = data;

    if (startTimestampMs < nowMs) {
        const error = new OperationError(
            SUBS_ERROR_START_TS_LT_NOW,
            'startTimestamp cannot be less than now'
        );

        return {
            result: null,
            error
        };
    }

    if (endTimestampMs !== null && endTimestampMs <= startTimestampMs) {
        const error = new OperationError(
            SUBS_ERROR_END_TS_LTE_START_TS,
            'endTimestamp must be greater than startTimestamp'
        );

        return {
            result: null,
            error
        };
    }

    const existedSubPlain = await Subscription.findOne({
        attributes: ['id'],
        where: { name },
        raw: true
    });

    if (existedSubPlain) {
        const error = new OperationError(
            SUBS_ERROR_NAME_ALREADY_EXISTS,
            'Name already exists'
        );

        return {
            result: null,
            error
        };
    }

    const createdSub = await Subscription.create({
        name,
        periodType,
        periods,
        price,
        requests,
        startTimestamp: startTimestampMs,
        endTimestamp: endTimestampMs
    });

    return {
        result: getPlainData(createdSub),
        error: null
    };
};

module.exports = createSubscriptionOperation;
