const Sequelize = require('sequelize');
const sequelize = require('../../config/sequelize');

const Key = sequelize.define('Key', {
    userId: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    key: {
        type: Sequelize.STRING(24),
        unique: true,
        allowNull: false
    }
}, {
    timestamps: false,
    underscored: true
});

module.exports = Key;
