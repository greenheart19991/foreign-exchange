const httpStatus = require('http-status-codes');
const { getReadOptions } = require('../../helpers/crud');
const readUsersOperation = require('./operations/read_users');

const list = async (req, res) => {
    const options = getReadOptions(req.query);
    const results = await readUsersOperation(options);

    return res.status(httpStatus.OK)
        .json(results);
};

const get = (req, res) => (
    res.status(httpStatus.OK)
        .json({ message: httpStatus.getStatusText(httpStatus.OK) })
);

module.exports = {
    list,
    get
};
