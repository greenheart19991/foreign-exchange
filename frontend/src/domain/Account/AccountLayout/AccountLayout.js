import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@material-ui/core';
import {
    RecentActors as RecentActorsIcon,
    ViewCarousel as ViewCarouselIcon,
    Person as PersonIcon
} from '@material-ui/icons';
import Drawer from './components/Drawer';
import { useAuthContext } from '../../../context/AuthContext';
import { ROLE_ADMIN } from '../../../consts/roles';
import styles from './AccountLayout.module.scss';

const getUserNavItems = (userId) => ([
    {
        icon: (
            <ViewCarouselIcon />
        ),
        title: 'Subscriptions',
        link: '/offers'
    },
    {
        icon: (
            <PersonIcon />
        ),
        title: 'Profile',
        link: `/users/${userId}`
    }
]);

const adminNavItems = [
    {
        icon: (
            <ViewCarouselIcon />
        ),
        title: 'Subscriptions',
        link: '/subscriptions'
    },
    {
        icon: (
            <RecentActorsIcon />
        ),
        title: 'Users',
        link: '/users'
    }
];

const AccountLayout = ({ children }) => {
    const { user } = useAuthContext();
    const [isOpen, setIsOpen] = useState(true);

    const isAdmin = user.role === ROLE_ADMIN;

    const navItems = isAdmin
        ? adminNavItems
        : getUserNavItems(user.id);

    return (
        <div className={styles.body}>
            <Drawer
                items={navItems}
                isOpen={isOpen}
                onToggle={() => setIsOpen(!isOpen)}
            />
            <Paper className={styles.page}>
                {children}
            </Paper>
        </div>
    );
};

AccountLayout.propTypes = {
    children: PropTypes.node.isRequired
};

export default AccountLayout;
