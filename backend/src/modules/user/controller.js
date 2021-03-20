const httpStatus = require('http-status-codes');

const list = (req, res) => (
    res.status(httpStatus.OK)
        .json({ message: httpStatus.getStatusText(httpStatus.OK) })
);

const get = (req, res) => (
    res.status(httpStatus.OK)
        .json({ message: httpStatus.getStatusText(httpStatus.OK) })
);

module.exports = {
    list,
    get
};
