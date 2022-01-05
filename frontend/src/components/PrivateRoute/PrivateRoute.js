import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const PrivateRoute = (props) => {
    const { user, error } = useAuthContext();
    const location = useLocation();

    const { component: Component, ...rest } = props;
    const isErrorUnauthenticated = error && error.response && error.response.status === 401;

    return (
        <Route {...rest}>
            {
                (!user || isErrorUnauthenticated)
                    ? (
                        <Redirect to={{ pathname: '/login', state: { referrer: location } }} />
                    )
                    : (
                        <Component />
                    )
            }
        </Route>
    );
};

// copy react-router-dom Route propTypes, but omit
// 'render' and 'children' props since PrivateRoute
// does not support this functionality.

// specify types explicitly because of
// Route.propTypes is not added during production build.

/* eslint-disable react/forbid-prop-types */

PrivateRoute.propTypes = {
    component: PropTypes.elementType,
    exact: PropTypes.bool,
    location: PropTypes.object,
    path: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
    ]),
    sensitive: PropTypes.bool,
    strict: PropTypes.bool
};

/* eslint-enable react/forbid-prop-types */

PrivateRoute.defaultProps = {
    component: null,
    exact: false,
    location: null,
    path: null,
    sensitive: false,
    strict: false
};

export default PrivateRoute;
