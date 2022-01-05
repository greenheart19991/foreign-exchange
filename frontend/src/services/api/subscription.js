import axios from '../axios';

const list = async ({ where, sort, offset, limit, unpublished }) => {
    const { data } = await axios.get('/subscriptions/', {
        params: {
            where,
            sort,
            offset,
            limit,
            unpublished
        }
    });

    const results = data.results.map((r) => ({
        ...r,
        price: parseFloat(r.price),
        startTimestamp: new Date(r.startTimestamp),
        endTimestamp: r.endTimestamp
            ? new Date(r.endTimestamp)
            : null
    }));

    return {
        ...data,
        results
    };
};

const get = async (id) => {
    const { data: s } = await axios.get(`/subscriptions/${id}`);

    const casted = {
        ...s,
        price: parseFloat(s.price),
        startTimestamp: new Date(s.startTimestamp),
        endTimestamp: s.endTimestamp
            ? new Date(s.endTimestamp)
            : null
    };

    return casted;
};

const create = async ({
    name,
    periodType,
    periods,
    requests,
    price,
    startTimestamp,
    endTimestamp
}) => {
    const sValues = {
        name,
        periodType,
        periods,
        requests,
        price
    };

    if (startTimestamp) {
        sValues.startTimestamp = startTimestamp.getTime();
    }

    if (endTimestamp) {
        sValues.endTimestamp = endTimestamp.getTime();
    }

    const { data: s } = await axios.post('/subscriptions/', sValues);

    const casted = {
        ...s,
        price: parseFloat(s.price),
        startTimestamp: new Date(s.startTimestamp),
        endTimestamp: s.endTimestamp
            ? new Date(s.endTimestamp)
            : null
    };

    return casted;
};

const archive = async (id) => {
    await axios.delete(`/subscriptions/${id}`);
};

export default {
    list,
    get,
    create,
    archive
};
