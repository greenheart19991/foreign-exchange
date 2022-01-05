import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Menu as MenuIcon } from '@material-ui/icons';
import {
    List, ListItem, ListItemIcon, ListItemText,
    Typography, IconButton
} from '@material-ui/core';
import styles from './Drawer.module.scss';

const Drawer = ({
    items,
    isOpen,
    onToggle
}) => (
    <div
        className={
            clsx(styles.drawer, { [styles.closed]: !isOpen })
        }
    >
        <div className={styles.header}>
            <IconButton
                color='inherit'
                onClick={onToggle}
            >
                <MenuIcon />
            </IconButton>
            <Typography
                component='h1'
                className={styles.brand}
            >
                For. Exch.
            </Typography>
        </div>
        <List component='nav'>
            {
                items.map(({ link, icon, title }) => (
                    <ListItem
                        key={link}
                        button
                        component={NavLink}
                        to={link}
                        activeClassName={styles.itemButtonActive}
                        classes={{ button: styles.itemButton }}
                    >
                        <ListItemIcon className={styles.itemIcon}>
                            {icon}
                        </ListItemIcon>
                        <ListItemText primary={title} />
                    </ListItem>
                ))
            }
        </List>
    </div>
);

Drawer.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        link: PropTypes.string.isRequired,
        icon: PropTypes.node.isRequired,
        title: PropTypes.string.isRequired
    })).isRequired,
    isOpen: PropTypes.bool,
    onToggle: PropTypes.func
};

Drawer.defaultProps = {
    isOpen: false,
    onToggle: null
};

export default Drawer;
