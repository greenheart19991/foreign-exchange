import axios from '../axios';

const get = async (userId) => {
    const { data: ko } = await axios.get(`/keys/${userId}`);
    return ko;
};

const create = async ({ userId }) => {
    const { data: ko } = await axios.post('/keys/', { userId });
    return ko;
};

const remove = async (userId) => {
    await axios.delete(`/keys/${userId}`);
};

export default {
    get,
    create,
    remove
};
