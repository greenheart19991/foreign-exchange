const httpStatus = require('http-status-codes');
const { getReadOptions } = require('../../helpers/crud');
const readOrdersOperation = require('./operations/read_orders');
const createOrderOperation = require('./operations/create_order');
const {
    ORDER_ERROR_SUB_NOT_FOUND,
    ORDER_ERROR_SUB_ARCHIVED,
    ORDER_ERROR_SUB_UNPUBLISHED
} = require('./constants/error_codes');

const list = async (req, res) => {
    const options = getReadOptions(req.query);
    const results = await readOrdersOperation(options);

    return res.status(httpStatus.OK)
        .json(results);
};

const create = async (req, res) => {
    const { subscriptionId } = req.body;
    const { result, error } = await createOrderOperation({ subscriptionId }, req.user);

    if (error) {
        if (error.code === ORDER_ERROR_SUB_NOT_FOUND) {
            return res.status(httpStatus.NOT_FOUND)
                .json({ message: 'Subscription not found' });
        }

        if (
            error.code === ORDER_ERROR_SUB_ARCHIVED
            || error.code === ORDER_ERROR_SUB_UNPUBLISHED
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
