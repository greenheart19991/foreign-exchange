const Subscription = require('./subscription');
const User = require('./user');
const Order = require('./order');
const Grant = require('./grant');
const RequestsUsage = require('./requests_usage');
const Key = require('./key');

const fkConstraints = {
    Order: {
        userId: {
            onUpdate: 'cascade',
            onDelete: 'set null'
        },
        subscriptionId: {
            onUpdate: 'cascade',
            onDelete: 'restrict'
        }
    },
    Grant: {
        userId: {
            onUpdate: 'cascade',
            onDelete: 'set null'
        },
        grantedBy: {
            onUpdate: 'cascade',
            onDelete: 'set null'
        },
        subscriptionId: {
            onUpdate: 'cascade',
            onDelete: 'restrict'
        }
    },
    RequestsUsage: {
        userId: {
            onUpdate: 'cascade',
            onDelete: 'set null'
        }
    },
    Key: {
        userId: {
            onUpdate: 'cascade',
            onDelete: 'cascade'
        }
    }
};

User.hasMany(Order, { foreignKey: 'userId', ...fkConstraints.Order.userId });
Order.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Grant, { foreignKey: 'userId', ...fkConstraints.Grant.userId });
User.hasMany(Grant, { foreignKey: 'grantedBy', ...fkConstraints.Grant.grantedBy });
Grant.belongsTo(User, { foreignKey: 'userId' });
Grant.belongsTo(User, { foreignKey: 'grantedBy' });

Subscription.hasMany(Order, { foreignKey: 'subscriptionId', ...fkConstraints.Order.subscriptionId });
Order.belongsTo(Subscription);

Subscription.hasMany(Grant, { foreignKey: 'subscriptionId', ...fkConstraints.Grant.subscriptionId });
Grant.belongsTo(Subscription);

User.hasMany(RequestsUsage, { foreignKey: 'userId', ...fkConstraints.RequestsUsage.userId });
RequestsUsage.belongsTo(User);

User.hasMany(Key, { foreignKey: 'userId', ...fkConstraints.Key.userId });
Key.belongsTo(User);

module.exports = {
    Subscription,
    User,
    Order,
    Grant,
    RequestsUsage,
    Key
};
