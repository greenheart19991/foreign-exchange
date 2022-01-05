import axios from '../axios';

const login = async ({ email, password }) => {
    await axios.post('/login', {
        email,
        password
    });
};

const logout = async () => {
    await axios.post('/logout');
};

const signup = async ({ firstName, lastName, email, password }) => {
    await axios.post('/signup', {
        firstName,
        lastName,
        email,
        password
    });
};

const getCurrentUser = async () => {
    const { data: u } = await axios.get('/users/me');

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

export default {
    login,
    logout,
    signup,
    getCurrentUser
};
