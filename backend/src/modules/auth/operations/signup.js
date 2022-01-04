const _ = require('lodash');
const { User } = require('../../../models');
const OperationError = require('../../../errors/operation_error');
const hashService = require('../../../services/BCryptHashService');
const { ROLE_USER } = require('../../../constants/roles');
const { AUTH_ERROR_EMAIL_ALREADY_EXISTS } = require('../constants/error_codes');
const { getPlainData } = require('../../../helpers/mapper');

const signupOperation = async ({ firstName, lastName, email, password }) => {
    // TODO: add password validation rules (here)
    //  (domain-related rules).

    const existedUserPlain = await User.findOne({
        attributes: ['id'],
        where: { email },
        raw: true
    });

    if (existedUserPlain) {
        const error = new OperationError(AUTH_ERROR_EMAIL_ALREADY_EXISTS, 'Email already exists');

        return {
            result: null,
            error
        };
    }

    const hash = await hashService.hash(password);

    const createdUser = await User.create({
        firstName,
        lastName,
        email,
        password: hash,
        role: ROLE_USER,
        isActive: true
    });

    const plain = getPlainData(createdUser);

    return {
        result: _.omit(plain, ['password']),
        error: null
    };
};

module.exports = signupOperation;
