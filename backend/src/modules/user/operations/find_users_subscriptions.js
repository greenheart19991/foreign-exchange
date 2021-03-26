const Sequelize = require('sequelize');
const { Order, Grant, Subscription } = require('../../../models');
const { getSubscriptionEndTimestamp } = require('../../../helpers/period');

/**
 * @typedef {Object} UserIdSubscriptionPair
 * @property {number} userId - User id
 * @property {Object} subscription - Subscription DTO
 */

/**
 * Finds subscriptions that users had at specific point in time
 *
 * @param {number[]} userIds
 * @param {Date} timestamp
 * @returns {Promise<UserIdSubscriptionPair[]>}
 */

const findUsersSubscriptionsOperation = async (userIds, timestamp) => {
    const lastOrdersByUser = await Order.findAll({
        attributes: [
            'id',
            'userId',
            'subscriptionId',
            [Sequelize.fn('max', Sequelize.col('timestamp')), 'timestamp']
        ],
        where: {
            userId: {
                [Sequelize.Op.in]: userIds
            }
        },
        group: ['userId', 'id']
    });

    const lastGrantsByUser = await Grant.findAll({
        attributes: [
            'id',
            'recipientId',
            'subscriptionId',
            [Sequelize.fn('max', Sequelize.col('timestamp')), 'timestamp']
        ],
        where: {
            recipientId: {
                [Sequelize.Op.in]: userIds
            }
        },
        group: ['recipientId', 'id']
    });

    const usersLastSubscriptions = userIds.reduce((acc, userId) => {
        const lastOrder = lastOrdersByUser.find((o) => o.userId === userId);
        const lastGrant = lastGrantsByUser.find((g) => g.recipientId === userId);

        let last = null;

        if (lastOrder && lastGrant) {
            last = lastOrder.timestamp >= lastGrant.timestamp
                ? lastOrder
                : lastGrant;
        } else if (lastOrder) {
            last = lastOrder;
        } else if (lastGrant) {
            last = lastGrant;
        }

        if (last !== null) {
            acc.push({
                userId,
                subscriptionId: last.subscriptionId,
                startTimestamp: last.timestamp,
                endTimestamp: last.endTimestamp
            });
        }

        return acc;
    }, []);

    const subscriptions = await Subscription.findAll({
        where: {
            id: {
                [Sequelize.Op.in]: usersLastSubscriptions.map(({ subscriptionId }) => subscriptionId)
            }
        },
        raw: true
    });

    const usersCurrentSubscriptions = userIds.reduce((acc, userId) => {
        const dsc = usersLastSubscriptions.find((r) => r.userId === userId);
        if (!dsc) {
            return acc;
        }

        const subscription = subscriptions.find(({ id }) => id === dsc.subscriptionId);

        const endTimestamp = dsc.endTimestamp
            || getSubscriptionEndTimestamp(dsc.startTimestamp, subscription.periodType, subscription.periods);

        if (endTimestamp < timestamp) {
            return acc;
        }

        acc.push({
            userId,
            subscription
        });

        return acc;
    }, []);

    return usersCurrentSubscriptions;
};

module.exports = findUsersSubscriptionsOperation;
