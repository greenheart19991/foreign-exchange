const userVOs = require('./data/20210315095804673/users.js');

const up = (qi, Sequelize) => qi.bulkInsert('users', userVOs);

const down = (qi, Sequelize) => qi.sequelize.transaction(
    async (transaction) => {
        await qi.bulkDelete('grants', {}, { transaction });
        await qi.bulkDelete('orders', {}, { transaction });
        await qi.bulkDelete('subscriptions', {}, { transaction });

        await qi.bulkDelete('requests_usages', {}, { transaction });
        await qi.bulkDelete('keys', {}, { transaction });
        await qi.bulkDelete('users', {}, { transaction });
    }
);

module.exports = {
    up,
    down
};
