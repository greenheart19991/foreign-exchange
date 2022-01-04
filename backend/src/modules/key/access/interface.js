const { belongsToMe } = require('./validators');

const isMyKeyInterface = (req) => {
    const { user } = req;
    const { userId } = req.params;

    return belongsToMe(user, userId);
};

const isForMeInterface = (req) => {
    const { user } = req;
    const { userId } = req.body;

    return belongsToMe(user, userId);
};

module.exports = {
    isMyKey: isMyKeyInterface,
    isForMe: isForMeInterface
};
