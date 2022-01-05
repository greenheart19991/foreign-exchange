import { createContext } from 'react';

const AuthContext = createContext({
    user: null,
    error: null,
    isLoading: false,
    loaded: false,
    setUser: () => {},
    loadCurrentUser: async () => {}
});

export default AuthContext;
