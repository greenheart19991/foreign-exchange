const { Order, Grant, RequestsUsage } = require('../../../models');
const findUsersSubscriptionsOperation = require('../../user/operations/find_users_subscriptions');
const { getPeriodBoundaries } = require('../../../helpers/period');

const getUsageOperation = async (userId) => {
    const now = new Date();
    const usersCurrentSubscriptions = await findUsersSubscriptionsOperation([userId], now);

    if (usersCurrentSubscriptions.length === 0) {
        return null;
    }

    const { subscription } = usersCurrentSubscriptions[0];

    const lastOrder = await Order.findOne({
        where: {
            userId,
            subscriptionId: subscription.id
        },
        order: [
            ['timestamp', 'desc'],
            ['id', 'desc']
        ],
        raw: true
    });

    const lastGrant = await Grant.findOne({
        where: {
            recipientId: userId,
            subscriptionId: subscription.id
        },
        order: [
            ['timestamp', 'desc'],
            ['id', 'desc']
        ],
        raw: true
    });

    let timestamp;

    if (lastOrder && lastGrant) {
        timestamp = lastOrder.timestamp >= lastGrant.timestamp
            ? lastOrder.timestamp
            : lastGrant.timestamp;
    } else if (lastOrder) {
        timestamp = lastOrder.timestamp;
    } else if (lastGrant) {
        timestamp = lastGrant.timestamp;
    }

    const { startTimestamp } = getPeriodBoundaries(
        now,
        timestamp,
        subscription.periodType
    );

    const usage = await RequestsUsage.findOne({
        where: {
            userId,
            periodStartTimestamp: startTimestamp
        },
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
