// https://dba.stackexchange.com/a/165923
const emailRegexpStr = '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?'
    + '(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$';

const up = (qi, Sequelize) => qi.sequelize.transaction(
    async (transaction) => {
        await qi.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            role: {
                type: Sequelize.ENUM,
                values: ['user', 'admin'],
                allowNull: false
            },
            first_name: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            last_name: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            email: {
                type: Sequelize.CITEXT,
                unique: true,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING(60),
                allowNull: false
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: true
            }
        }, { transaction });

        await qi.addConstraint('users', ['first_name'], {
            type: 'check',
            name: 'users_first_name_empty_check',
            where: { first_name: { [Sequelize.Op.ne]: '' } },
            transaction
        });

        await qi.addConstraint('users', ['last_name'], {
            type: 'check',
            name: 'users_last_name_empty_check',
            where: { last_name: { [Sequelize.Op.ne]: '' } },
            transaction
        });

        await qi.addConstraint('users', ['email'], {
            type: 'check',
            name: 'users_email_check',
            where: { email: { [Sequelize.Op.regexp]: emailRegexpStr } },
            transaction
        });
    }
);

const down = (qi, Sequelize) => qi.dropTable('users');

module.exports = {
    up,
    down
};
