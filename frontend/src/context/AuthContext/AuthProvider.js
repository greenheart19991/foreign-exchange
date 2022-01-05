import React from 'react';
import PropTypes from 'prop-types';
import AuthContext from './AuthContext';
import useAuthProvider from './hooks/useAuthProvider';

const AuthProvider = ({ children }) => {
    const context = useAuthProvider();

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AuthProvider;
