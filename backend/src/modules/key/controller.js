const httpStatus = require('http-status-codes');
const getKeyOperation = require('./operations/get_key');
const createKeyOperation = require('./operations/create_key');
const deleteKeyOperation = require('./operations/delete_key');
const {
    KEY_ERROR_KEY_NOT_FOUND,
    KEY_ERROR_USER_NOT_FOUND,
    KEY_ERROR_USER_MULTIPLE_KEYS
} = require('./constants/error_codes');

const get = async (req, res) => {
    const { userId } = req.params;
    const key = await getKeyOperation(userId);

    if (!key) {
        return res.status(httpStatus.NOT_FOUND)
            .json({ message: 'Key not found' });
    }

    return res.status(httpStatus.OK)
        .json(key);
};

const create = async (req, res) => {
    const { userId } = req.body;
    const { result, error } = await createKeyOperation({ userId });

    if (error) {
        if (
            error.code === KEY_ERROR_USER_NOT_FOUND
            || error.code === KEY_ERROR_USER_MULTIPLE_KEYS
        ) {
            return res.status(httpStatus.CONFLICT)
                .json({ message: error.message });
        }

        throw error;
    }

    return res.status(httpStatus.CREATED)
        .json(result);
};

const remove = async (req, res) => {
    const { userId } = req.params;
    const { error } = await deleteKeyOperation(userId);

    if (error) {
        if (error.code === KEY_ERROR_KEY_NOT_FOUND) {
            return res.status(httpStatus.NOT_FOUND)
                .json({ message: 'Key not found' });
        }

        throw error;
    }

    return res
        .status(httpStatus.NO_CONTENT)
        .json();
};

module.exports = {
    get,
    create,
    remove
};
