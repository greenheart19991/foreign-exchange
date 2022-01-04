const { User } = require('../../../models');
const findUsersSubscriptionsOperation = require('./find_users_subscriptions');

const getUserOperation = async (id) => {
    const now = new Date();

    const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        raw: true
    });

    if (!user) {
        return null;
    }

    const usersCurrentSubscriptions = await findUsersSubscriptionsOperation([id], now);
    if (usersCurrentSubscriptions.length === 0) {
        return user;
    }

    return {
        ...user,
        subscription: usersCurrentSubscriptions[0].subscription
    };
};

module.exports = getUserOperation;
