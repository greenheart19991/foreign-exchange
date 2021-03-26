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
        recipientId: {
            onUpdate: 'cascade',
            onDelete: 'set null'
        },
        committerId: {
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

User.hasMany(Grant, { foreignKey: 'recipientId', as: 'ReceivedGrants', ...fkConstraints.Grant.recipientId });
User.hasMany(Grant, { foreignKey: 'committerId', as: 'CommittedGrants', ...fkConstraints.Grant.committerId });
Grant.belongsTo(User, { foreignKey: 'recipientId', as: 'Recipient' });
Grant.belongsTo(User, { foreignKey: 'committerId', as: 'Committer' });

Subscription.hasMany(Order, { foreignKey: 'subscriptionId', ...fkConstraints.Order.subscriptionId });
Order.belongsTo(Subscription, { foreignKey: 'subscriptionId' });

Subscription.hasMany(Grant, { foreignKey: 'subscriptionId', ...fkConstraints.Grant.subscriptionId });
Grant.belongsTo(Subscription, { foreignKey: 'subscriptionId' });

User.hasMany(RequestsUsage, { foreignKey: 'userId', ...fkConstraints.RequestsUsage.userId });
RequestsUsage.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Key, { foreignKey: 'userId', ...fkConstraints.Key.userId });
Key.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    Subscription,
    User,
    Order,
    Grant,
    RequestsUsage,
    Key
};
