const httpStatus = require('http-status-codes');
const cookie = require('cookie');
const config = require('../../../config/config');
const { getReadOptions } = require('../../helpers/crud');
const readUsersOperation = require('./operations/read_users');
const getUserOperation = require('./operations/get_user');
const createUserOperation = require('./operations/create_user');
const updateUserOperation = require('./operations/update_user');
const deleteUserOperation = require('./operations/delete_user');
const { COOKIE_SID_KEY, COOKIE_SID_OPTIONS } = require('../../constants/cookie');
const {
    USER_ERROR_USER_NOT_FOUND,
    USER_ERROR_EMAIL_ALREADY_EXISTS,
    USER_ERROR_FORBIDDEN_SET_ROLE,
    USER_ERROR_FORBIDDEN_SET_IS_ACTIVE
} = require('./constants/error_codes');

const list = async (req, res) => {
    const options = getReadOptions(req.query);
    const results = await readUsersOperation(options);

    return res.status(httpStatus.OK)
        .json(results);
};

const get = async (req, res) => {
    const { id } = req.params;
    const user = await getUserOperation(id);

    if (!user) {
        return res.status(httpStatus.NOT_FOUND)
            .json({ message: 'User not found' });
    }

    return res.status(httpStatus.OK)
        .json(user);
};

const getMyself = async (req, res) => {
    const { id } = req.user;
    const user = await getUserOperation(id);

    // exceptional case

    if (!user) {
        return res.status(httpStatus.NOT_FOUND)
            .json({ message: 'User not found' });
    }

    return res.status(httpStatus.OK)
        .json(user);
};

const create = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        role,
        isActive
    } = req.body;

    const { result: user, error } = await createUserOperation({
        firstName,
        lastName,
        email,
        password,
        role,
        isActive
    });

    if (error) {
        if (error.code === USER_ERROR_EMAIL_ALREADY_EXISTS) {
            return res.status(httpStatus.CONFLICT)
                .json({ message: 'User with such email already exists' });
        }

        throw error;
    }

    return res.status(httpStatus.CREATED)
        .json(user);
};

const patch = async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body };

    const { error } = await updateUserOperation(id, data, req.user);

    if (error) {
        if (
            error.code === USER_ERROR_FORBIDDEN_SET_ROLE
            || error.code === USER_ERROR_FORBIDDEN_SET_IS_ACTIVE
        ) {
            return res.status(httpStatus.FORBIDDEN)
                .json({ message: error.message });
        }

        if (error.code === USER_ERROR_USER_NOT_FOUND) {
            return res.status(httpStatus.NOT_FOUND)
                .json({ message: 'User not found' });
        }

        if (error.code === USER_ERROR_EMAIL_ALREADY_EXISTS) {
            return res.status(httpStatus.CONFLICT)
                .json({ message: 'User with such email already exists' });
        }

        throw error;
    }

    return res
        .status(httpStatus.NO_CONTENT)
        .end();
};

const remove = async (req, res) => {
    const { id } = req.params;
    const { error } = await deleteUserOperation(id);

    if (error) {
        if (error.code === USER_ERROR_USER_NOT_FOUND) {
            return res.status(httpStatus.NOT_FOUND)
                .json({ message: 'User not found' });
        }

        throw error;
    }

    if (id === req.user.id) {
        // clear sid cookie
        // if user deletes himself

        const setCookie = cookie.serialize(COOKIE_SID_KEY, '', {
            ...COOKIE_SID_OPTIONS,
            secure: config.cookie.secure,
            expires: new Date(0)
        });

        res.append('Set-Cookie', setCookie);
    }

    return res
        .status(httpStatus.NO_CONTENT)
        .end();
};

module.exports = {
    list,
    get,
    getMyself,
    create,
    patch,
    remove
};
