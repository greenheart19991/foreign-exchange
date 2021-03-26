const isMyOrders = (userMe, filter = {}) => userMe.id === filter.userId;

const isForMe = (userMe, orderUserId) => userMe.id === orderUserId;

module.exports = {
    isMyOrders,
    isForMe
};
