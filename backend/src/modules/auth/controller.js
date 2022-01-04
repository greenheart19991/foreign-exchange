const httpStatus = require('http-status-codes');
const cookie = require('cookie');
const config = require('../../../config/config');
const loginOperation = require('./operations/login');
const signupOperation = require('./operations/signup');
const createSessionOperation = require('./operations/create_session');
const deleteSessionOperation = require('./operations/delete_session');
const { COOKIE_SID_KEY, COOKIE_SID_OPTIONS } = require('../../constants/cookie');
const {
    AUTH_ERROR_USER_NOT_FOUND,
    AUTH_ERROR_INVALID_PASSWORD,
    AUTH_ERROR_EMAIL_ALREADY_EXISTS
} = require('./constants/error_codes');

const login = async (req, res) => {
    const { email, password } = req.body;

    const { result: user, error } = await loginOperation(email, password);

    if (error) {
        if (
            error.code === AUTH_ERROR_USER_NOT_FOUND
            || error.code === AUTH_ERROR_INVALID_PASSWORD
        ) {
            return res.status(httpStatus.UNAUTHORIZED)
                .json({ message: 'Invalid email or password' });
        }

        throw error;
    }

    const session = await createSessionOperation(user.id);

    const setCookie = cookie.serialize(COOKIE_SID_KEY, session.id, {
        ...COOKIE_SID_OPTIONS,
        secure: config.cookie.secure,
        expires: session.expiresAt
    });

    return res
        .append('Set-Cookie', setCookie)
        .status(httpStatus.CREATED)
        .end();
};

const logout = async (req, res) => {
    await deleteSessionOperation(req.session.id);

    // clear sid cookie
    const setCookie = cookie.serialize(COOKIE_SID_KEY, '', {
        ...COOKIE_SID_OPTIONS,
        secure: config.cookie.secure,
        expires: new Date(0)
    });

    return res
        .append('Set-Cookie', setCookie)
        .status(httpStatus.NO_CONTENT)
        .end();
};

const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const { result: user, error } = await signupOperation({ firstName, lastName, email, password });

    if (error) {
        if (error.code === AUTH_ERROR_EMAIL_ALREADY_EXISTS) {
            return res.status(httpStatus.CONFLICT)
                .json({ message: 'User with such email already exists' });
        }

        throw error;
    }

    const session = await createSessionOperation(user.id);

    const setCookie = cookie.serialize(COOKIE_SID_KEY, session.id, {
        ...COOKIE_SID_OPTIONS,
        secure: config.cookie.secure,
        expires: session.expiresAt
    });

    return res
        .append('Set-Cookie', setCookie)
        .status(httpStatus.CREATED)
        .end();
};

module.exports = {
    login,
    logout,
    signup
};
