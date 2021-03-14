const Sequelize = require('sequelize');
const sequelize = require('../../config/sequelize');

const Order = sequelize.define('Order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    subscriptionId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    timestamp: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, {
    timestamps: false,
    underscored: true
});

module.exports = Order;
