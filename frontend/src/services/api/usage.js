import axios from '../axios';

const get = async (userId) => {
    const { data: row } = await axios.get('/usage/', {
        params: { userId }
    });

    if (!row) {
        return null;
    }

    const casted = {
        ...row,
        periodStartTimestamp: new Date(row.periodStartTimestamp)
    };

    return casted;
};

export default {
    get
};
