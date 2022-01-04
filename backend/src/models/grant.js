const Sequelize = require('sequelize');
const sequelize = require('../../config/sequelize');

const Grant = sequelize.define('Grant', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    recipientId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    committerId: {
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
    },
    endTimestamp: {
        type: Sequelize.DATE,
        allowNull: true
    }
}, {
    timestamps: false,
    underscored: true
});

module.exports = Grant;
