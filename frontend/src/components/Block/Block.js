import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Paper } from '@material-ui/core';
import styles from './Block.module.scss';

const Block = ({ PaperProps, children }) => (
    <Paper
        variant='outlined'
        {...PaperProps}
        className={clsx(styles.paper, PaperProps.className)}
    >
        {children}
    </Paper>
);

Block.propTypes = {
    PaperProps: PropTypes.shape(Paper.propTypes),
    children: PropTypes.node
};

Block.defaultProps = {
    PaperProps: {},
    children: null
};

export default Block;
