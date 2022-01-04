const isMyGrants = (userMe, filter = {}) => userMe.id === filter.recipientId;

module.exports = {
    isMyGrants
};
