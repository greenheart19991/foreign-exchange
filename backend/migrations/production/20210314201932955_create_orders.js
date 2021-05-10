const up = (qi, Sequelize) => qi.createTable('orders', {
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
    }
});

const down = (qi, Sequelize) => qi.dropTable('orders');

module.exports = {
    up,
    down
};
