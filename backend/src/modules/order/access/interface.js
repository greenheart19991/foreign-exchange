const { isMyOrders, isForMe } = require('./validators');

const isMyOrdersInterface = (req) => {
    const { user } = req;
    const { where } = req.query;

    return isMyOrders(user, where);
};

const isForMeInterface = (req) => {
    const { user } = req;
    const { userId } = req.body;

    return isForMe(user, userId);
};

module.exports = {
    isMyOrders: isMyOrdersInterface,
    isForMe: isForMeInterface
};
