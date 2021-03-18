const httpStatus = require('http-status-codes');
const cookie = require('cookie');
const config = require('../../config/config');
const findSessionOperation = require('../modules/auth/operations/find_session');
const deleteSessionOperation = require('../modules/auth/operations/delete_session');
const createSessionOperation = require('../modules/auth/operations/create_session');
const findUserOperation = require('../modules/user/operations/find_user');
const { COOKIE_SID_KEY, COOKIE_SID_OPTIONS } = require('../constants/cookie');
const { SID_BYTE_LEN } = require('../constants/session');

const authenticate = async (req, res, next) => {
    if (!req.headers.cookie) {
        return res.status(httpStatus.UNAUTHORIZED)
            .json({ message: 'No session id provided' });
    }

    const c = cookie.parse(req.headers.cookie);
    const sid = c[COOKIE_SID_KEY];

    if (!sid) {
        return res.status(httpStatus.UNAUTHORIZED)
            .json({ message: 'No session id provided' });
    }

    if (Buffer.byteLength(sid) !== SID_BYTE_LEN) {
        return res.status(httpStatus.UNAUTHORIZED)
            .json({ message: 'Invalid session id' });
    }

    let session = await findSessionOperation(sid);
    if (!session) {
        return res.status(httpStatus.UNAUTHORIZED)
            .json({ message: 'Session not found' });
    }

    const now = new Date();

    if (session.blocksAt < now) {
        await deleteSessionOperation(session.id);
        session = await createSessionOperation(session.userId);

        const setCookie = cookie.serialize(COOKIE_SID_KEY, session.id, {
            ...COOKIE_SID_OPTIONS,
            secure: config.cookie.secure,
            expires: session.expiresAt
        });

        res.append('Set-Cookie', setCookie);
    }

    const user = await findUserOperation(session.userId);

    req.user = user;
    req.session = session;

    return next();
};

module.exports = authenticate;
