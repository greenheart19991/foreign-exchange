const httpStatus = require('http-status-codes');
const getKeyOperation = require('./operations/get_key');

const get = async (req, res) => {
    const { userId } = req.query;
    const key = await getKeyOperation(userId);

    if (!key) {
        return res
            .status(httpStatus.NO_CONTENT)
            .end();
    }

    return res.status(httpStatus.OK)
        .json(key);
};

module.exports = {
    get
};
