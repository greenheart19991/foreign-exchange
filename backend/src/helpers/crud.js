const { CRUD_READ_DEFAULT_LIMIT } = require('../constants/crud');

const systemDefaults = {
    where: {},
    sort: [],
    offset: 0,
    limit: CRUD_READ_DEFAULT_LIMIT
};

const getReadOptions = (values, userDefaults) => {
    const defaults = {
        ...systemDefaults,
        ...userDefaults
    };

    const {
        where = defaults.where,
        sort = defaults.sort,
        offset = defaults.offset,
        limit = defaults.limit
    } = values;

    return {
        where,
        sort,
        offset,
        limit
    };
};

module.exports = {
    getReadOptions
};
