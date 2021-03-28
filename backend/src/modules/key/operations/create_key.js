const { User, Key } = require('../../../models');
const OperationError = require('../../../errors/operation_error');
const keyService = require('../../../services/UIDKeyService');
const { getPlainData } = require('../../../helpers/mapper');
const {
    KEY_ERROR_USER_NOT_FOUND,
    KEY_ERROR_USER_MULTIPLE_KEYS
} = require('../constants/error_codes');

const createKeyOperation = async ({ userId }) => {
    const user = await User.findByPk(userId, {
        include: { model: Key },
        attributes: ['id']
    });

    if (!user) {
        const error = new OperationError(
            KEY_ERROR_USER_NOT_FOUND,
            'User not found'
        );

        return {
            result: null,
            error
        };
    }

    if (user.Key) {
        const error = new OperationError(
            KEY_ERROR_USER_MULTIPLE_KEYS,
            'User already has a key'
        );

        return {
            result: null,
            error
        };
    }

    const str = await keyService.generate();
    const key = await Key.create({
        userId,
        key: str
    });

    return {
        result: getPlainData(key),
        error: null
    };
};

module.exports = createKeyOperation;
