import axios from '../axios';

const list = async ({ where, sort, offset, limit }) => {
    const { data } = await axios.get('/grants/', {
        params: {
            where,
            sort,
            offset,
            limit
        }
    });

    const results = data.results.map(({
        timestamp,
        endTimestamp,
        subscription,
        ...r
    }) => ({
        ...r,
        timestamp: new Date(timestamp),
        endTimestamp: endTimestamp
            ? new Date(endTimestamp)
            : null,
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

const create = async ({ recipientId, subscriptionId, endTimestamp }) => {
    const gValues = {
        recipientId,
        subscriptionId
    };

    if (endTimestamp) {
        gValues.endTimestamp = endTimestamp.getTime();
    }

    const {
        data: {
            timestamp: responseTimestamp,
            endTimestamp: responseEndTimestamp,
            subscription,
            ...r
        }
    } = await axios.post('/grants/', gValues);

    const casted = {
        ...r,
        timestamp: new Date(responseTimestamp),
        endTimestamp: responseEndTimestamp
            ? new Date(responseEndTimestamp)
            : null,
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
