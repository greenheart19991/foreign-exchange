import React from 'react';
import { useAuthContext } from '../../context/AuthContext';

const hasRole = (roles) => (Component) => (props) => {
    const { user } = useAuthContext();
    const isAuthorized = roles.includes(user.role);

    return (
        <Component isAuthorized={isAuthorized} {...props} />
    );
};

export default hasRole;
