import axios from '../axios';

const list = async ({ where, sort, offset, limit }) => {
    const { data } = await axios.get('/orders/', {
        params: {
            where,
            sort,
            offset,
            limit
        }
    });

    const results = data.results.map(({ timestamp, subscription, ...r }) => ({
        ...r,
        timestamp: new Date(timestamp),
        subscription: {
            ...subscription,
            price: parseFloat(subscription.price),
            startTimestamp: new Date(subscription.startTimestamp),
            endTimestamp: subscription.endTimestamp
                ? new Date(subscription.endTimestamp)
                : null
        }
    }));

    return {
        ...data,
        results
    };
};

const create = async ({ subscriptionId }) => {
    const {
        data: {
            timestamp,
            subscription,
            ...r
        }
    } = await axios.post('/orders/', { subscriptionId });

    const casted = {
        ...r,
        timestamp: new Date(timestamp),
        subscription: {
            ...subscription,
            price: parseFloat(subscription.price),
            startTimestamp: new Date(subscription.startTimestamp),
            endTimestamp: subscription.endTimestamp
                ? new Date(subscription.endTimestamp)
                : null
        }
    };

    return casted;
};

export default {
    list,
    create
};
