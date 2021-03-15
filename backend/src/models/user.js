const Sequelize = require('sequelize');
const sequelize = require('../../config/sequelize');
const { ROLE_USER, ROLE_ADMIN } = require('../consts/roles');

const User = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    role: {
        type: Sequelize.ENUM,
        values: [ROLE_USER, ROLE_ADMIN],
        allowNull: false
    },
    firstName: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    email: {
        type: Sequelize.CITEXT,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(60).BINARY,
        allowNull: false
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
}, {
    timestamps: false,
    underscored: true
});

module.exports = User;
