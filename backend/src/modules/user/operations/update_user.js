const _ = require('lodash');
const { User } = require('../../../models');
const OperationError = require('../../../errors/operation_error');
const encryptionService = require('../../../services/BCryptEncryptionService');
const { getPlainData } = require('../../../helpers/mapper');
const {
    USER_ERROR_USER_NOT_FOUND,
    USER_ERROR_FORBIDDEN_SET_ROLE,
    USER_ERROR_FORBIDDEN_SET_IS_ACTIVE,
    USER_ERROR_EMAIL_ALREADY_EXISTS
} = require('../constants/error_codes');

const updateUserOperation = async (id, data, sessionUser) => {
    if (sessionUser.id === id) {
        let error;

        if (_.has(data, 'role')) {
            error = new OperationError(
                USER_ERROR_FORBIDDEN_SET_ROLE,
                'Setting role for yourself is not allowed'
            );
        } else if (_.has(data, 'isActive')) {
            error = new OperationError(
                USER_ERROR_FORBIDDEN_SET_IS_ACTIVE,
                'Setting isActive for yourself is not allowed'
            );
        }

        if (error) {
            return {
                result: null,
                error
            };
        }
    }

    const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
    });

    if (!user) {
        const error = new OperationError(USER_ERROR_USER_NOT_FOUND, 'User not found');

        return {
            result: null,
            error
        };
    }

    if (
        _.has(data, 'email')
        && data.email !== user.email
    ) {
        const userByNewEmail = await User.findOne({
            where: { email: data.email },
            raw: true
        });

        if (userByNewEmail) {
            const error = new OperationError(
                USER_ERROR_EMAIL_ALREADY_EXISTS,
                'Email already exists'
            );

            return {
                result: null,
                error
            };
        }
    }

    const values = _.omit(data, ['password']);
    if (data.password) {
        values.password = await encryptionService.encrypt(data.password);
    }

    const updatedUser = await user.update(values);
    const updatedUserPlain = getPlainData(updatedUser);

    return {
        result: _.omit(updatedUserPlain, ['password']),
        error: null
    };
};

module.exports = updateUserOperation;
