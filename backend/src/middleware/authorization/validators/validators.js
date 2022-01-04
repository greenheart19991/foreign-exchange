const or = (values) => values.some((v) => v);

const and = (values) => values.every((v) => v);

const not = (value) => !value;

const hasRole = (user, roles) => roles.includes(user.role);

module.exports = {
    or,
    and,
    not,
    hasRole
};
