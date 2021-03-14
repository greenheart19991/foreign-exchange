const Sequelize = require('sequelize');
const sequelize = require('../../config/sequelize');

const Grant = sequelize.define('Grant', {
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
    },
    endTimestamp: {
        type: Sequelize.DATE,
        allowNull: true
    },
    grantedBy: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false,
    underscored: true
});

module.exports = Grant;
