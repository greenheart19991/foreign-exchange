const { Subscription } = require('../../../models');
const { getPlainData } = require('../../../helpers/mapper');
const OperationError = require('../../../errors/operation_error');
const {
    SUBS_ERROR_START_TS_LT_NOW,
    SUBS_ERROR_END_TS_LTE_START_TS,
    SUBS_ERROR_NAME_ALREADY_EXISTS
} = require('../constants/error_codes');

const createSubscriptionOperation = async (data) => {
    const now = new Date();
    const {
        name,
        periodType,
        periods,
        price,
        requests,
        startTimestamp = now,
        endTimestamp = null
    } = data;

    if (startTimestamp < now) {
        const error = new OperationError(
            SUBS_ERROR_START_TS_LT_NOW,
            'Start timestamp cannot be less than now'
        );

        return {
            result: null,
            error
        };
    }

    if (endTimestamp !== null && endTimestamp <= startTimestamp) {
        const error = new OperationError(
            SUBS_ERROR_END_TS_LTE_START_TS,
            'End timestamp must be greater than start timestamp'
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
        startTimestamp,
        endTimestamp
    });

    return {
        result: getPlainData(createdSub),
        error: null
    };
};

module.exports = createSubscriptionOperation;
