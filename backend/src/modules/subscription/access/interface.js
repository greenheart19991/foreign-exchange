const { isPublishedOnly } = require('./validators');

const isPublishedOnlyInterface = (req) => {
    const { unpublished } = req.query;
    return isPublishedOnly(unpublished);
};

module.exports = {
    isPublishedOnly: isPublishedOnlyInterface
};
