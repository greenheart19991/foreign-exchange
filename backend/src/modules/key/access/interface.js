const { isMyKey } = require('./validators');

const isMyKeyInterface = (req) => {
    const { user } = req;
    const { userId } = req.query;

    return isMyKey(user, userId);
};

module.exports = {
    isMyKey: isMyKeyInterface
};
