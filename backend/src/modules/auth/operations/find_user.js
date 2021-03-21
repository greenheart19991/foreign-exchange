const { User } = require('../../../models');

const findUserOperation = async (id) => {
    const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        raw: true
    });

    if (!user) {
        return null;
    }

    return user;
};

module.exports = findUserOperation;
