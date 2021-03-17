const COOKIE_SID_KEY = 'sid';

const COOKIE_SID_OPTIONS = {
    httpOnly: true,
    sameSite: true,
    // ?set '/api/management/' or where the management app will be
    // ('/' - default)
    path: '/'
};

module.exports = {
    COOKIE_SID_KEY,
    COOKIE_SID_OPTIONS
};
