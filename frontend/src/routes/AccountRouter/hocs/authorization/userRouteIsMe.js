import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../../../context/AuthContext';

const userRouteIsMe = (Component) => (props) => {
    const params = useParams();
    const { user } = useAuthContext();

    const userId = 'id' in params
        ? parseInt(params.id, 0)
        : null;

    const isAuthorized = userId === user.id;

    return (
        <Component isAuthorized={isAuthorized} {...props} />
    );
};

export default userRouteIsMe;
