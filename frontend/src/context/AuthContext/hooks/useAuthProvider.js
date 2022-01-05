import { useState } from 'react';
import api from '../../../services/api';

const useAuthProvider = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const loadCurrentUser = async () => {
        setError(null);
        setIsLoading(true);
        setLoaded(false);

        try {
            const { subscription, ...fetchedUser } = await api.auth.getCurrentUser();
            setUser(fetchedUser);
        } catch (e) {
            setUser(null);
            setError(e);
        }

        setIsLoading(false);
        setLoaded(true);
    };

    return {
        user,
        error,
        isLoading,
        loaded,
        setUser,
        loadCurrentUser
    };
};

export default useAuthProvider;
