const Sequelize = require('sequelize');
const sequelize = require('../../config/sequelize');
const { PERIOD_TYPE_MONTH, PERIOD_TYPE_YEAR } = require('../consts/period_types');

const Subscription = sequelize.define('Subscription', {
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
    periodType: {
        type: Sequelize.ENUM,
        values: [PERIOD_TYPE_MONTH, PERIOD_TYPE_YEAR],
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
    startTimestamp: {
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

module.exports = Subscription;
