const httpStatus = require('http-status-codes');
const { getReadOptions } = require('../../helpers/crud');
const readUsersOperation = require('./operations/read_users');
const getUserOperation = require('./operations/get_user');
const createUserOperation = require('./operations/create_user');
const { USER_ERROR_EMAIL_ALREADY_EXISTS } = require('./constants/error_codes');

const list = async (req, res) => {
    const options = getReadOptions(req.query);
    const results = await readUsersOperation(options);

    return res.status(httpStatus.OK)
        .json(results);
};

const get = async (req, res) => {
    const { id } = req.params;
    const user = await getUserOperation(id);

    if (!user) {
        return res.status(httpStatus.NOT_FOUND)
            .json({ message: 'User not found' });
    }

    return res.status(httpStatus.OK)
        .json(user);
};

const getMyself = async (req, res) => {
    const { id } = req.user;
    const user = await getUserOperation(id);

    // exceptional case

    if (!user) {
        return res.status(httpStatus.NOT_FOUND)
            .json({ message: 'User not found' });
    }

    return res.status(httpStatus.OK)
        .json(user);
};

const create = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        role,
        isActive
    } = req.body;

    const { result: user, error } = await createUserOperation({
        firstName,
        lastName,
        email,
        password,
        role,
        isActive
    });

    if (error) {
        if (error.code === USER_ERROR_EMAIL_ALREADY_EXISTS) {
            return res.status(httpStatus.CONFLICT)
                .json({ message: 'User with such email already exists' });
        }

        throw error;
    }

    return res.status(httpStatus.CREATED)
        .json(user);
};

module.exports = {
    list,
    get,
    getMyself,
    create
};
