const { Subscription } = require('../../../models');
const OperationError = require('../../../errors/operation_error');
const {
    SUBS_ERROR_SUB_NOT_FOUND,
    SUBS_ERROR_SUB_ALREADY_ARCHIVED
} = require('../constants/error_codes');

const archiveSubscriptionOperation = async (id) => {
    const now = new Date();
    const subscription = await Subscription.findByPk(id);

    if (!subscription) {
        const error = new OperationError(
            SUBS_ERROR_SUB_NOT_FOUND,
            'Subscription not found'
        );

        return { error };
    }

    if (subscription.endTimestamp !== null && subscription.endTimestamp <= now) {
        const error = new OperationError(
            SUBS_ERROR_SUB_ALREADY_ARCHIVED,
            'Subscription already archived'
        );

        return { error };
    }

    await subscription.update({ endTimestamp: now });

    return { error: null };
};

module.exports = archiveSubscriptionOperation;
