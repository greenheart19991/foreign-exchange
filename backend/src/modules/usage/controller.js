const httpStatus = require('http-status-codes');
const getUsageOperation = require('./operations/get_usage');

const get = async (req, res) => {
    const { userId } = req.query;
    const usage = await getUsageOperation(userId);

    if (!usage) {
        return res
            .status(httpStatus.NO_CONTENT)
            .end();
    }

    return res.status(httpStatus.OK)
        .json(usage);
};

module.exports = {
    get
};
