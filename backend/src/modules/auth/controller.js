const httpStatus = require('http-status-codes');
const cookie = require('cookie');
const config = require('../../../config/config');
const loginOperation = require('./operations/login');
const createSessionOperation = require('./operations/create_session');
const { COOKIE_SID_KEY, COOKIE_SID_OPTIONS } = require('../../constants/cookie');
const {
    AUTH_ERROR_USER_NOT_FOUND,
    AUTH_ERROR_INVALID_PASSWORD
} = require('./constants/error_codes');

const login = async (req, res) => {
    const { email, password } = req.body;

    const { result: user, error: loginError } = await loginOperation(email, password);
    if (
        loginError
        && (
            loginError.code === AUTH_ERROR_USER_NOT_FOUND
            || loginError.code === AUTH_ERROR_INVALID_PASSWORD
        )
    ) {
        return res.status(httpStatus.UNAUTHORIZED)
            .json({ message: 'Invalid email or password' });
    }

    const session = await createSessionOperation(user);

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
    login
};
