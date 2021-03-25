const Sequelize = require('sequelize');
const { Subscription } = require('../../../models');

const readSubscriptionsOperation = async (readUnpublished, options) => {
    const { where: pWhere, sort, limit, offset } = options;
    const now = new Date();

    const where = readUnpublished
        ? pWhere
        : {
            ...pWhere,
            [Sequelize.Op.and]: [
                { startTimestamp: { [Sequelize.Op.lte]: now } },
                {
                    [Sequelize.Op.or]: [
                        { endTimestamp: { [Sequelize.Op.is]: null } },
                        { startTimestamp: { [Sequelize.Op.lt]: Sequelize.col('end_timestamp') } }
                    ]
                }
            ]
        };

    const { rows, count } = await Subscription.findAndCountAll({
        where,
        sort,
        offset,
        limit,
        raw: true
    });

    return {
        results: rows,
        sort,
        count
    };
};

module.exports = readSubscriptionsOperation;
