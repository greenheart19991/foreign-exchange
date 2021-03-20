const { isMe } = require('./validators');

const isMeInterface = (req) => {
    const { user } = req;
    const { id } = req.params;

    return isMe(user, id);
};

module.exports = {
    isMe: isMeInterface
};
