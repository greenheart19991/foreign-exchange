const Sequelize = require('sequelize');
const sequelize = require('../../../../config/sequelize');
const { Subscription } = require('../../../models');
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
    const lastOrdersByUser = await sequelize.query(`
        WITH ranked_orders AS (
            SELECT id,
                   user_id,
                   subscription_id,
                   timestamp,
                   row_number() OVER (
                       PARTITION BY user_id
                       ORDER BY
                           timestamp DESC,
                           id DESC
                       ) AS rn
            FROM orders
            WHERE user_id IN (:userIds)
        )
        SELECT id,
               user_id         AS "userId",
               subscription_id AS "subscriptionId",
               timestamp
        FROM ranked_orders
        WHERE rn = 1
    `, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { userIds }
    });

    const lastGrantsByUser = await sequelize.query(`
        WITH ranked_grants AS (
            SELECT id,
                   recipient_id,
                   subscription_id,
                   timestamp,
                   end_timestamp,
                   row_number() OVER (
                       PARTITION BY recipient_id
                       ORDER BY
                           timestamp DESC,
                           id DESC
                       ) AS rn
            FROM grants
            WHERE recipient_id IN (:recipientIds)
        )
        SELECT id,
               recipient_id    AS "recipientId",
               subscription_id AS "subscriptionId",
               timestamp,
               end_timestamp   AS "endTimestamp"
        FROM ranked_grants
        WHERE rn = 1
    `, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { recipientIds: userIds }
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

    const usersCurrentSubscriptions = usersLastSubscriptions.reduce((acc, dsc) => {
        const subscription = subscriptions.find(
            ({ id }) => id === dsc.subscriptionId
        );

        const endTimestamp = dsc.endTimestamp || getSubscriptionEndTimestamp(
            dsc.startTimestamp,
            subscription.periodType,
            subscription.periods
        );

        if (endTimestamp < timestamp) {
            return acc;
        }

        acc.push({
            userId: dsc.userId,
            subscription
        });

        return acc;
    }, []);

    return usersCurrentSubscriptions;
};

module.exports = findUsersSubscriptionsOperation;
