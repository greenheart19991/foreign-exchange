const { RequestsUsage } = require('../../../models');
const findUsersSubscriptionsOperation = require('../../user/operations/find_users_subscriptions');
const { getPeriodBoundaries } = require('../../../helpers/period');

const getUsageOperation = async (userId) => {
    const now = new Date();
    const usersCurrentSubscriptions = await findUsersSubscriptionsOperation([userId], now);

    if (usersCurrentSubscriptions.length === 0) {
        return null;
    }

    const { subscription } = usersCurrentSubscriptions[0];
    const { startTimestamp } = getPeriodBoundaries(
        now,
        subscription.startTimestamp,
        subscription.periodType
    );

    const usage = await RequestsUsage.findOne({
        where: { periodStartTimestamp: startTimestamp },
        order: [
            ['periodStartTimestamp', 'desc'],
            ['id', 'desc']
        ],
        attributes: ['requestsUsed'],
        raw: true
    });

    const requestsUsed = usage ? usage.requestsUsed : 0;

    return {
        userId,
        requestsUsed,
        periodStartTimestamp: startTimestamp
    };
};

module.exports = getUsageOperation;
