const httpStatus = require('http-status-codes');
const { getReadOptions } = require('../../helpers/crud');
const readOrdersOperation = require('./operations/read_orders');

const list = async (req, res) => {
    const options = getReadOptions(req.query);
    const results = await readOrdersOperation(options);

    return res.status(httpStatus.OK)
        .json(results);
};

module.exports = {
    list
};
