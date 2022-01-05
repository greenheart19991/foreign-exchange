import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { CircularProgress } from '@material-ui/core';
import styles from './Loader.module.scss';

const Loader = ({ className, CircularProgressProps }) => (
    <div className={clsx(styles.container, className)}>
        <CircularProgress
            size={52}
            {...CircularProgressProps}
        />
    </div>
);

Loader.propTypes = {
    className: PropTypes.string,
    CircularProgressProps: PropTypes.shape(CircularProgress.propTypes)
};

Loader.defaultProps = {
    className: null,
    CircularProgressProps: {}
};

export default Loader;
