const _ = require('lodash');
const { Grant, User, Subscription } = require('../../../models');
const { getPlainData } = require('../../../helpers/mapper');

const readGrantsOperation = async (options) => {
    const { where, sort, limit, offset } = options;

    const { rows: grants, count } = await Grant.findAndCountAll({
        include: [
            {
                model: User,
                as: 'Committer',
                attributes: { exclude: ['password'] }
            },
            {
                model: Subscription
            }
        ],
        attributes: {
            exclude: ['committerId', 'subscriptionId']
        },
        where,
        order: sort,
        limit,
        offset
    });

    const results = grants.map((grant) => {
        const plain = getPlainData(grant);
        const omitted = _.omit(plain, ['Committer', 'Subscription']);

        return {
            ...omitted,
            committer: plain.Committer,
            subscription: plain.Subscription
        };
    });

    return {
        results,
        sort,
        count
    };
};

module.exports = readGrantsOperation;
