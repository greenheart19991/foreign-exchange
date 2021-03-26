const httpStatus = require('http-status-codes');
const { getReadOptions } = require('../../helpers/crud');
const readGrantsOperation = require('./operations/read_grants');

const list = async (req, res) => {
    const options = getReadOptions(req.query);
    const results = await readGrantsOperation(options);

    return res.status(httpStatus.OK)
        .json(results);
};

module.exports = {
    list
};
