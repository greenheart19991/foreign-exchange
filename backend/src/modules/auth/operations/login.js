const _ = require('lodash');
const { User } = require('../../../models');
const OperationError = require('../../../errors/operation_error');
const hashService = require('../../../services/BCryptHashService');
const {
    AUTH_ERROR_USER_NOT_FOUND,
    AUTH_ERROR_INVALID_PASSWORD
} = require('../constants/error_codes');

const loginOperation = async (email, password) => {
    const user = await User.findOne({
        where: { email },
        raw: true
    });

    if (!user) {
        const error = new OperationError(AUTH_ERROR_USER_NOT_FOUND, 'User not found');

        return {
            result: null,
            error
        };
    }

    const isPasswordValid = await hashService.compare(password, user.password);

    if (!isPasswordValid) {
        const error = new OperationError(AUTH_ERROR_INVALID_PASSWORD, 'Invalid password');

        return {
            result: null,
            error
        };
    }

    return {
        result: _.omit(user, ['password']),
        error: null
    };
};

module.exports = loginOperation;
