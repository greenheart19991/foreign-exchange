const { isMyUsage } = require('./validators');

const isMyUsageInterface = (req) => {
    const { user } = req;
    const { userId } = req.query;

    return isMyUsage(user, userId);
};

module.exports = {
    isMyUsage: isMyUsageInterface
};
