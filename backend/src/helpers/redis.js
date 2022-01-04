const separator = ':';

const getRedisKey = (key, ...namespaces) => {
    if (namespaces.length === 0) {
        return key;
    }

    const namespace = namespaces.join(':');

    return `${namespace}${separator}${key}`;
};

module.exports = {
    getRedisKey
};
