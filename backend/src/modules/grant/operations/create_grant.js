const _ = require('lodash');
const { User, Grant, Subscription } = require('../../../models');
const { getPlainData } = require('../../../helpers/mapper');
const { getSubscriptionEndTimestamp } = require('../../../helpers/period');
const OperationError = require('../../../errors/operation_error');
const {
    GRANT_ERROR_END_TS_LT_NOW,
    GRANT_ERROR_END_TS_GT_SUB_EXP,
    GRANT_ERROR_RECIPIENT_NOT_FOUND,
    GRANT_ERROR_SUB_NOT_FOUND,
    GRANT_ERROR_SUB_ARCHIVED,
    GRANT_ERROR_SUB_UNPUBLISHED
} = require('../constants/error_codes');

const createGrantOperation = async (data, sessionUser) => {
    const now = new Date();
    const {
        recipientId,
        subscriptionId,
        endTimestamp = null
    } = data;

    if (endTimestamp !== null && endTimestamp < now) {
        const error = new OperationError(
            GRANT_ERROR_END_TS_LT_NOW,
            'End timestamp cannot be less than now'
        );

        return {
            result: null,
            error
        };
    }

    const recipient = await User.findByPk(recipientId);
    if (!recipient) {
        const error = new OperationError(
            GRANT_ERROR_RECIPIENT_NOT_FOUND,
            'Recipient not found'
        );

        return {
            result: null,
            error
        };
    }

    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
        const error = new OperationError(
            GRANT_ERROR_SUB_NOT_FOUND,
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
            GRANT_ERROR_SUB_ARCHIVED,
            'Subscription is archived'
        );

        return {
            result: null,
            error
        };
    }

    if (subscription.startTimestamp > now) {
        const error = new OperationError(
            GRANT_ERROR_SUB_UNPUBLISHED,
            'Subscription is unpublished'
        );

        return {
            result: null,
            error
        };
    }

    const expiresAtByDefault = getSubscriptionEndTimestamp(
        now,
        subscription.periodType,
        subscription.periods
    );

    if (endTimestamp !== null && endTimestamp >= expiresAtByDefault) {
        const error = new OperationError(
            GRANT_ERROR_END_TS_GT_SUB_EXP,
            'End timestamp cannot be after time subscription expires'
        );

        return {
            result: null,
            error
        };
    }

    const grant = await Grant.create({
        recipientId,
        subscriptionId,
        endTimestamp,
        timestamp: now,
        committerId: sessionUser.id
    });

    const grantPlain = getPlainData(grant);
    const subscriptionPlain = getPlainData(subscription);

    const result = {
        ...(_.omit(grantPlain, ['subscriptionId', 'committerId'])),
        subscription: subscriptionPlain,
        committer: sessionUser
    };

    return {
        result,
        error: null
    };
};

module.exports = createGrantOperation;
