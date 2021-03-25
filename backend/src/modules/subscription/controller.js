const httpStatus = require('http-status-codes');
const { getReadOptions } = require('../../helpers/crud');
const readSubscriptionsOperation = require('./operations/read_subscriptions');

const list = async (req, res) => {
    const { unpublished } = req.query;
    const options = getReadOptions(req.query);

    const results = await readSubscriptionsOperation(unpublished, options);

    return res.status(httpStatus.OK)
        .json(results);
};

module.exports = {
    list
};
