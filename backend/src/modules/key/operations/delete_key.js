const { Key } = require('../../../models');
const OperationError = require('../../../errors/operation_error');
const { KEY_ERROR_KEY_NOT_FOUND } = require('../constants/error_codes');

const deleteKeyOperation = async (userId) => {
    const key = await Key.findByPk(userId, {
        attributes: ['userId']
    });

    if (!key) {
        const error = new OperationError(KEY_ERROR_KEY_NOT_FOUND, 'Key not found');
        return { error };
    }

    await key.destroy();

    return { error: null };
};

module.exports = deleteKeyOperation;
