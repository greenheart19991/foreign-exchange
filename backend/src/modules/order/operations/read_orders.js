const _ = require('lodash');
const { Order, Subscription } = require('../../../models');
const { getPlainData } = require('../../../helpers/mapper');

const readOrdersOperation = async (options) => {
    const { where, sort, limit, offset } = options;

    const { rows: orders, count } = await Order.findAndCountAll({
        include: { model: Subscription },
        attributes: { exclude: ['subscriptionId'] },
        where,
        sort,
        offset,
        limit
    });

    const results = orders.map((order) => {
        const plain = getPlainData(order);
        const omitted = _.omit(plain, ['Subscription']);

        return {
            ...omitted,
            subscription: plain.Subscription
        };
    });

    return {
        results,
        sort,
        count
    };
};

module.exports = readOrdersOperation;
