const { Key } = require('../../../models');

const deleteKeyOperation = async (userId) => Key.destroy({
    where: { userId }
});

module.exports = deleteKeyOperation;
