const _ = require('lodash');
const { User } = require('../../../models');
const OperationError = require('../../../errors/operation_error');
const hashService = require('../../../services/BCryptHashService');
const { USER_ERROR_EMAIL_ALREADY_EXISTS } = require('../constants/error_codes');
const { getPlainData } = require('../../../helpers/mapper');

const createUserOperation = async ({
    firstName,
    lastName,
    email,
    password,
    role,
    isActive
}) => {
    // TODO: autogenerate password
    //  and send email

    const existedUserPlain = await User.findOne({
        attributes: ['id'],
        where: { email },
        raw: true
    });

    if (existedUserPlain) {
        const error = new OperationError(USER_ERROR_EMAIL_ALREADY_EXISTS, 'Email already exists');

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
        role,
        isActive,
        password: hash
    });

    const plain = getPlainData(createdUser);

    return {
        result: _.omit(plain, ['password']),
        error: null
    };
};

module.exports = createUserOperation;
