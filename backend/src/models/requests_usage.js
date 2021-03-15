const Sequelize = require('sequelize');
const sequelize = require('../../config/sequelize');

const RequestsUsage = sequelize.define('RequestsUsage', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    periodStartTimestamp: {
        type: Sequelize.DATE,
        allowNull: false
    },
    requestsUsed: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    underscored: true,
    freezeTableName: true
});

module.exports = RequestsUsage;
