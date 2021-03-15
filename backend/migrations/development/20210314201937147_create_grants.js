const up = (qi, Sequelize) => qi.sequelize.transaction(
    async (transaction) => {
        await qi.createTable('grants', {
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
            subscription_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'subscriptions',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'restrict'
            },
            timestamp: {
                type: Sequelize.DATE,
                allowNull: false
            },
            end_timestamp: {
                type: Sequelize.DATE,
                allowNull: true
            },
            granted_by: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'set null'
            }
        }, { transaction });

        await qi.addConstraint('grants', ['timestamp', 'end_timestamp'], {
            type: 'check',
            name: 'grants_timestamps_check',
            where: {
                [Sequelize.Op.or]: [
                    { end_timestamp: { [Sequelize.Op.is]: null } },
                    { end_timestamp: { [Sequelize.Op.gt]: Sequelize.col('timestamp') } }
                ]
            },
            transaction
        });
    }
);

const down = (qi, Sequelize) => qi.dropTable('grants');

module.exports = {
    up,
    down
};
