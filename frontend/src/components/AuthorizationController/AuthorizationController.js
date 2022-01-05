import React from 'react';
import PropTypes from 'prop-types';

const createAuthorizationController = (Component, NotAuthorizedComponent) => {
    const AuthorizationController = (props) => {
        const { isAuthorized, ...rest } = props;
        return isAuthorized
            ? (
                <Component {...rest} />
            )
            : (
                <NotAuthorizedComponent {...rest} />
            );
    };

    AuthorizationController.propTypes = {
        isAuthorized: PropTypes.bool
    };

    AuthorizationController.defaultProps = {
        isAuthorized: false
    };

    return AuthorizationController;
};

export {
    createAuthorizationController
};
