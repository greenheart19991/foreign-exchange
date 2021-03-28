const { User } = require('../../../models');
const findUsersSubscriptionsOperation = require('./find_users_subscriptions');

const readUsersOperation = async (options) => {
    const { where, sort, limit, offset } = options;
    const now = new Date();

    const { rows: users, count } = await User.findAndCountAll({
        attributes: { exclude: ['password'] },
        where,
        order: sort,
        limit,
        offset,
        raw: true
    });

    if (users.length === 0) {
        return {
            results: users,
            sort,
            count
        };
    }

    const userIds = users.map((u) => u.id);
    const usersCurrentSubscriptions = await findUsersSubscriptionsOperation(userIds, now);

    const usersWithSubscriptions = users.map((user) => {
        const row = usersCurrentSubscriptions.find((r) => r.userId === user.id);
        if (!row) {
            return user;
        }

        return {
            ...user,
            subscription: row.subscription
        };
    });

    return {
        results: usersWithSubscriptions,
        sort,
        count
    };
};

module.exports = readUsersOperation;
