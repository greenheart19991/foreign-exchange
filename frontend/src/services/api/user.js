import axios from '../axios';

const list = async ({ where, sort, offset, limit }) => {
    const { data } = await axios.get('/users/', {
        params: {
            where,
            sort,
            offset,
            limit
        }
    });

    const results = data.results.map((r) => {
        if (!r.subscription) {
            return r;
        }

        return {
            ...r,
            subscription: {
                ...r.subscription,
                price: parseFloat(r.subscription.price),
                startTimestamp: new Date(r.subscription.startTimestamp),
                endTimestamp: r.subscription.endTimestamp
                    ? new Date(r.subscription.endTimestamp)
                    : null
            }
        };
    });

    return {
        ...data,
        results
    };
};

const get = async (id) => {
    const { data: u } = await axios.get(`/users/${id}`);

    if (!u.subscription) {
        return u;
    }

    const casted = {
        ...u,
        subscription: {
            ...u.subscription,
            price: parseFloat(u.subscription.price),
            startTimestamp: new Date(u.subscription.startTimestamp),
            endTimestamp: u.subscription.endTimestamp
                ? new Date(u.subscription.endTimestamp)
                : null
        }
    };

    return casted;
};

const create = async (values) => {
    const { data: u } = await axios.post('/users/', values);
    return u;
};

const patch = async (id, values) => {
    await axios.patch(`/users/${id}`, values);
};

const remove = async (id) => {
    await axios.delete(`/users/${id}`);
};

export default {
    list,
    get,
    create,
    patch,
    remove
};
