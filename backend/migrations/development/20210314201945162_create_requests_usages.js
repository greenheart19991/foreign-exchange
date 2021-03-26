const up = (qi, Sequelize) => qi.sequelize.transaction(
    async (transaction) => {
        await qi.createTable('requests_usages', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'set null'
            },
            period_start_timestamp: {
                type: Sequelize.DATE,
                allowNull: false
            },
            requests_used: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        }, { transaction });

        await qi.addConstraint('requests_usages', ['requests_used'], {
            type: 'check',
            name: 'requests_usages_requests_used_check',
            where: { requests_used: { [Sequelize.Op.gte]: 0 } },
            transaction
        });
    }
);

const down = (qi, Sequelize) => qi.dropTable('requests_usages');

module.exports = {
    up,
    down
};
