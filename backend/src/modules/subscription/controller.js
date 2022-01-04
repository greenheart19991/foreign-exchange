const _ = require('lodash');
const httpStatus = require('http-status-codes');
const { getReadOptions } = require('../../helpers/crud');
const readSubscriptionsOperation = require('./operations/read_subscriptions');
const getSubscriptionOperation = require('./operations/get_subscription');
const createSubscriptionOperation = require('./operations/create_subscription');
const archiveSubscriptionOperation = require('./operations/archive_subscription');
const {
    SUBS_ERROR_START_TS_LT_NOW,
    SUBS_ERROR_END_TS_LTE_START_TS,
    SUBS_ERROR_NAME_ALREADY_EXISTS,
    SUBS_ERROR_FORBIDDEN_SUB_UNPUBLISHED,
    SUBS_ERROR_SUB_NOT_FOUND,
    SUBS_ERROR_SUB_ALREADY_ARCHIVED
} = require('./constants/error_codes');

const list = async (req, res) => {
    const { unpublished } = req.query;
    const options = getReadOptions(req.query);

    const results = await readSubscriptionsOperation(unpublished, options);

    return res.status(httpStatus.OK)
        .json(results);
};

const get = async (req, res) => {
    const { id } = req.params;
    const { result, error } = await getSubscriptionOperation(id, req.user);

    if (error) {
        if (error.code === SUBS_ERROR_FORBIDDEN_SUB_UNPUBLISHED) {
            return res.status(httpStatus.FORBIDDEN)
                .json({ message: httpStatus.getStatusText(httpStatus.FORBIDDEN) });
        }

        throw error;
    }

    if (!result) {
        return res.status(httpStatus.NOT_FOUND)
            .json({ message: 'Subscription not found' });
    }

    return res.status(httpStatus.OK)
        .json(result);
};

const create = async (req, res) => {
    const {
        name,
        periodType,
        periods,
        price,
        requests,
        startTimestamp: startTimestampMs,
        endTimestamp: endTimestampMs
    } = req.body;

    const startTimestamp = _.isNumber(startTimestampMs)
        ? new Date(startTimestampMs)
        : startTimestampMs;

    const endTimestamp = _.isNumber(endTimestampMs)
        ? new Date(endTimestampMs)
        : endTimestampMs;

    const { result, error } = await createSubscriptionOperation({
        name,
        periodType,
        periods,
        price,
        requests,
        startTimestamp,
        endTimestamp
    });

    if (error) {
        if (
            error.code === SUBS_ERROR_START_TS_LT_NOW
            || error.code === SUBS_ERROR_END_TS_LTE_START_TS
        ) {
            return res.status(httpStatus.BAD_REQUEST)
                .json({ message: error.message });
        }

        if (error.code === SUBS_ERROR_NAME_ALREADY_EXISTS) {
            return res.status(httpStatus.CONFLICT)
                .json({ message: 'Subscription with such name already exists' });
        }

        throw error;
    }

    return res.status(httpStatus.CREATED)
        .json(result);
};

const archive = async (req, res) => {
    const { id } = req.params;
    const { error } = await archiveSubscriptionOperation(id);

    if (error) {
        if (error.code === SUBS_ERROR_SUB_NOT_FOUND) {
            return res.status(httpStatus.NOT_FOUND)
                .json({ message: 'Subscription not found' });
        }

        if (error.code === SUBS_ERROR_SUB_ALREADY_ARCHIVED) {
            return res.status(httpStatus.CONFLICT)
                .json({ message: 'Subscription already archived' });
        }

        throw error;
    }

    return res
        .status(httpStatus.NO_CONTENT)
        .end();
};

module.exports = {
    list,
    get,
    create,
    archive
};
