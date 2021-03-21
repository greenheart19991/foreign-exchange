const _ = require('lodash');
const { User } = require('../../../models');

const findUserOperation = async (id) => {
    const user = await User.findByPk(id, {
        raw: true
    });

    if (!user) {
        return null;
    }

    return _.omit(user, ['password']);
};

module.exports = findUserOperation;
