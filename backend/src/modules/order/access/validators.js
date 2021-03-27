const isMyOrders = (userMe, filter = {}) => userMe.id === filter.userId;

module.exports = {
    isMyOrders
};
