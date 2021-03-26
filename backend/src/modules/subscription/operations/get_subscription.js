const { Subscription } = require('../../../models');
const OperationError = require('../../../errors/operation_error');
const { ROLE_USER } = require('../../../constants/roles');
const { SUBS_ERROR_FORBIDDEN_SUB_UNPUBLISHED } = require('../constants/error_codes');

const getSubscriptionOperation = async (id, sessionUser) => {
    const now = new Date();
    const subscription = await Subscription.findByPk(id, { raw: true });

    if (!subscription) {
        return {
            result: null,
            error: null
        };
    }

    const isNotPublished = subscription.startTimestamp > now
        || (
            subscription.endTimestamp !== null
            && subscription.endTimestamp <= subscription.startTimestamp
        );

    if (
        sessionUser.role === ROLE_USER
        && isNotPublished
    ) {
        const error = new OperationError(
            SUBS_ERROR_FORBIDDEN_SUB_UNPUBLISHED,
            'Subscription is unpublished'
        );

        return {
            result: null,
            error
        };
    }

    return {
        result: subscription,
        error: null
    };
};

module.exports = getSubscriptionOperation;
