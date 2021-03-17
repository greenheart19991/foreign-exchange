const up = (qi, Sequelize) => qi.sequelize.transaction(
    async (transaction) => {
        await qi.createTable('subscriptions', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING(255),
                unique: true,
                allowNull: false
            },
            period_type: {
                type: Sequelize.ENUM,
                values: ['month', 'year'],
                allowNull: false
            },
            periods: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            price: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false
            },
            requests: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            start_timestamp: {
                type: Sequelize.DATE,
                allowNull: false
            },
            end_timestamp: {
                type: Sequelize.DATE,
                allowNull: true
            }
        }, { transaction });

        await qi.addConstraint('subscriptions', ['name'], {
            type: 'check',
            name: 'subscriptions_name_empty_check',
            where: { name: { [Sequelize.Op.ne]: '' } },
            transaction
        });

        await qi.addConstraint('subscriptions', ['periods'], {
            type: 'check',
            name: 'subscriptions_periods_check',
            where: { periods: { [Sequelize.Op.gt]: 0 } },
            transaction
        });

        await qi.addConstraint('subscriptions', ['price'], {
            type: 'check',
            name: 'subscriptions_price_check',
            where: { price: { [Sequelize.Op.gte]: 0 } },
            transaction
        });

        await qi.addConstraint('subscriptions', ['requests'], {
            type: 'check',
            name: 'subscriptions_requests_check',
            where: { requests: { [Sequelize.Op.gt]: 0 } },
            transaction
        });

        await qi.addConstraint('subscriptions', ['start_timestamp', 'end_timestamp'], {
            type: 'check',
            name: 'subscriptions_timestamps_check',
            where: {
                [Sequelize.Op.or]: [
                    { end_timestamp: { [Sequelize.Op.is]: null } },
                    { end_timestamp: { [Sequelize.Op.gt]: Sequelize.col('start_timestamp') } }
                ]
            },
            transaction
        });
    }
);

const down = (qi, Sequelize) => qi.dropTable('subscriptions');

module.exports = {
    up,
    down
};
