const { Key } = require('../../../models');

const getKeyOperation = async (userId) => {
    const key = await Key.findByPk(userId, {
        raw: true
    });

    if (!key) {
        return null;
    }

    return key;
};

module.exports = getKeyOperation;
