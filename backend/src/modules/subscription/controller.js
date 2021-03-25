const httpStatus = require('http-status-codes');
const { getReadOptions } = require('../../helpers/crud');
const readSubscriptionsOperation = require('./operations/read_subscriptions');
const getSubscriptionOperation = require('./operations/get_subscription');
const createSubscriptionOperation = require('./operations/create_subscription');
const {
    SUBS_ERROR_START_TS_LT_NOW,
    SUBS_ERROR_END_TS_LTE_START_TS,
    SUBS_ERROR_NAME_ALREADY_EXISTS,
    SUBS_ERROR_FORBIDDEN_SUB_UNPUBLISHED
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
        startTimestamp,
        endTimestamp
    } = req.body;

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

module.exports = {
    list,
    get,
    create
};
