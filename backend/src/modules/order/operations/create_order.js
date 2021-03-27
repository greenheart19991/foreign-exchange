const _ = require('lodash');
const { Order, Subscription } = require('../../../models');
const { getPlainData } = require('../../../helpers/mapper');
const OperationError = require('../../../errors/operation_error');
const {
    ORDER_ERROR_SUB_NOT_FOUND,
    ORDER_ERROR_SUB_ARCHIVED,
    ORDER_ERROR_SUB_UNPUBLISHED
} = require('../constants/error_codes');

const createOrderOperation = async ({ subscriptionId }, sessionUser) => {
    const now = new Date();
    const subscription = await Subscription.findByPk(subscriptionId);

    if (!subscription) {
        const error = new OperationError(
            ORDER_ERROR_SUB_NOT_FOUND,
            'Subscription not found'
        );

        return {
            result: null,
            error
        };
    }

    if (
        subscription.endTimestamp !== null
        && subscription.endTimestamp <= now
    ) {
        const error = new OperationError(
            ORDER_ERROR_SUB_ARCHIVED,
            'Subscription is archived'
        );

        return {
            result: null,
            error
        };
    }

    if (subscription.startTimestamp > now) {
        const error = new OperationError(
            ORDER_ERROR_SUB_UNPUBLISHED,
            'Subscription is unpublished'
        );

        return {
            result: null,
            error
        };
    }

    const order = await Order.create({
        subscriptionId,
        userId: sessionUser.id,
        timestamp: now
    });

    const orderPlain = getPlainData(order);
    const subscriptionPlain = getPlainData(subscription);

    const result = {
        ...(_.omit(orderPlain, ['subscriptionId'])),
        subscription: subscriptionPlain
    };

    return {
        result,
        error: null
    };
};

module.exports = createOrderOperation;
