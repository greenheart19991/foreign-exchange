const subscriptionVOs = require('./data/20210315095804673/subscriptions.json');
const userVOs = require('./data/20210315095804673/users.js');
const orderVOs = require('./data/20210315095804673/orders.json');
const grantVOs = require('./data/20210315095804673/grants.json');
const requestsUsageVOs = require('./data/20210315095804673/requests_usage.json');

const up = (qi, Sequelize) => qi.sequelize.transaction(
    async (transaction) => {
        await qi.bulkInsert('subscriptions', subscriptionVOs, { transaction });
        await qi.bulkInsert('users', userVOs, { transaction });

        const subscriptions = await qi.sequelize.query('SELECT id, name FROM subscriptions', {
            type: Sequelize.QueryTypes.SELECT,
            transaction
        });

        const users = await qi.sequelize.query('SELECT id, email FROM users', {
            type: Sequelize.QueryTypes.SELECT,
            transaction
        });

        const subscriptionsByName = subscriptions.reduce((acc, v) => {
            acc[v.name] = v;
            return acc;
        }, {});

        const usersByEmail = users.reduce((acc, v) => {
            acc[v.email] = v;
            return acc;
        }, {});

        const orderVOsPrepared = orderVOs.map(({ user, subscription, ...rest }) => ({
            user_id: usersByEmail[user].id,
            subscription_id: subscriptionsByName[subscription].id,
            ...rest
        }));

        await qi.bulkInsert('orders', orderVOsPrepared, { transaction });

        const grantVOsPrepared = grantVOs.map(({ user, subscription, granted_by, ...rest }) => ({
            user_id: usersByEmail[user].id,
            subscription_id: subscriptionsByName[subscription].id,
            granted_by: usersByEmail[granted_by].id,
            ...rest
        }));

        await qi.bulkInsert('grants', grantVOsPrepared, { transaction });

        const requestsUsageVOsPrepared = requestsUsageVOs.map(({ user, ...rest }) => ({
            user_id: usersByEmail[user].id,
            ...rest
        }));

        await qi.bulkInsert('requests_usage', requestsUsageVOsPrepared, { transaction });
    }
);

const down = (qi, Sequelize) => qi.sequelize.transaction(
    async (transaction) => {
        await qi.bulkDelete('grants', {}, { transaction });
        await qi.bulkDelete('orders', {}, { transaction });
        await qi.bulkDelete('subscriptions', {}, { transaction });

        await qi.bulkDelete('requests_usage', {}, { transaction });
        await qi.bulkDelete('keys', {}, { transaction });
        await qi.bulkDelete('users', {}, { transaction });
    }
);

module.exports = {
    up,
    down
};
