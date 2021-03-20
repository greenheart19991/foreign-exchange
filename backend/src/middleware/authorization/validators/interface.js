const { or, and, hasRole } = require('./validators');

const orInterfaceFactory = (...validatorsInterfaces) => async (req) => {
    const results = await Promise.all(
        validatorsInterfaces.map((vi) => vi(req))
    );

    return or(results);
};

const andInterfaceFactory = (...validatorsInterfaces) => async (req) => {
    const results = await Promise.all(
        validatorsInterfaces.map((vi) => vi(req))
    );

    return and(results);
};

const hasRoleInterfaceFactory = (roles) => (req) => {
    const { user } = req;
    return hasRole(user, roles);
};

module.exports = {
    or: orInterfaceFactory,
    and: andInterfaceFactory,
    hasRole: hasRoleInterfaceFactory
};
