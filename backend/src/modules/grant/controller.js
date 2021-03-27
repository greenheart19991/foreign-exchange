const _ = require('lodash');
const httpStatus = require('http-status-codes');
const { getReadOptions } = require('../../helpers/crud');
const readGrantsOperation = require('./operations/read_grants');
const createGrantOperation = require('./operations/create_grant');
const {
    GRANT_ERROR_END_TS_LT_NOW,
    GRANT_ERROR_END_TS_GT_SUB_EXP,
    GRANT_ERROR_RECIPIENT_NOT_FOUND,
    GRANT_ERROR_SUB_NOT_FOUND,
    GRANT_ERROR_SUB_ARCHIVED,
    GRANT_ERROR_SUB_UNPUBLISHED
} = require('./constants/error_codes');

const list = async (req, res) => {
    const options = getReadOptions(req.query);
    const results = await readGrantsOperation(options);

    return res.status(httpStatus.OK)
        .json(results);
};

const create = async (req, res) => {
    const {
        recipientId,
        subscriptionId,
        endTimestamp: endTimestampMs
    } = req.body;

    const endTimestamp = _.isNumber(endTimestampMs)
        ? new Date(endTimestampMs)
        : endTimestampMs;

    const { result, error } = await createGrantOperation({
        recipientId,
        subscriptionId,
        endTimestamp
    }, req.user);

    if (error) {
        if (error.code === GRANT_ERROR_END_TS_LT_NOW) {
            return res.status(httpStatus.BAD_REQUEST)
                .json({ message: error.message });
        }

        if (error.code === GRANT_ERROR_RECIPIENT_NOT_FOUND) {
            return res.status(httpStatus.NOT_FOUND)
                .json({ message: 'Recipient user not found' });
        }

        if (error.code === GRANT_ERROR_SUB_NOT_FOUND) {
            return res.status(httpStatus.NOT_FOUND)
                .json({ message: 'Subscription not found' });
        }

        if (
            error.code === GRANT_ERROR_SUB_ARCHIVED
            || error.code === GRANT_ERROR_SUB_UNPUBLISHED
            || error.code === GRANT_ERROR_END_TS_GT_SUB_EXP
        ) {
            return res.status(httpStatus.CONFLICT)
                .json({ message: error.message });
        }

        throw error;
    }

    return res.status(httpStatus.CREATED)
        .json(result);
};

module.exports = {
    list,
    create
};
