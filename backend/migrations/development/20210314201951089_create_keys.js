const up = (qi, Sequelize) => qi.sequelize.transaction(
    async (transaction) => {
        await qi.createTable('keys', {
            user_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            key: {
                type: Sequelize.STRING(32),
                unique: true,
                allowNull: false
            }
        }, { transaction });

        await qi.addConstraint('keys', ['key'], {
            type: 'check',
            name: 'keys_key_empty_check',
            where: { key: { [Sequelize.Op.ne]: '' } },
            transaction
        });
    }
);

const down = (qi, Sequelize) => qi.dropTable('keys');

module.exports = {
    up,
    down
};
