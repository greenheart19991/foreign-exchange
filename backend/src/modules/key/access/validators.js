const isMyKey = (userMe, userId = {}) => userMe.id === userId;

module.exports = {
    isMyKey
};
