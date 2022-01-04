const { isMyOrders } = require('./validators');

const isMyOrdersInterface = (req) => {
    const { user } = req;
    const { where } = req.query;

    return isMyOrders(user, where);
};

module.exports = {
    isMyOrders: isMyOrdersInterface
};
