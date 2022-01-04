const { isMyGrants } = require('./validators');

const isMyGrantsInterface = (req) => {
    const { user } = req;
    const { where } = req.query;

    return isMyGrants(user, where);
};

module.exports = {
    isMyGrants: isMyGrantsInterface
};
