import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import {
    Typography, Link, Button,
    Menu, MenuItem
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useAuthContext } from '../../../context/AuthContext';
import { getAPIResponseErrorSummary } from '../../../helpers/api';
import api from '../../../services/api';
import styles from './AccountHeader.module.scss';

const AccountHeader = ({ title }) => {
    const history = useHistory();
    const { user, setUser } = useAuthContext();

    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const onClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const onMenuClose = () => {
        if (!isLoading) {
            setAnchorEl(null);
        }
    };

    const onLogOut = async () => {
        setIsLoading(true);

        try {
            await api.auth.logout();
        } catch (e) {
            const { status, message } = getAPIResponseErrorSummary(e);

            setError({
                status,
                message
            });

            setIsLoading(false);
            setAnchorEl(null);

            return;
        }

        setUser(null);
        history.push('/login');
    };

    return (
        <Fragment>
            <header className={styles.header}>
                {
                    title && (
                        <Typography
                            variant='h6'
                            className={styles.title}
                        >
                            {title}
                        </Typography>
                    )
                }
                <Button
                    type='button'
                    onClick={onClick}
                >
                    <Typography className={styles.username}>
                        {`${user.firstName} ${user.lastName}`}
                    </Typography>
                </Button>
                <Menu
                    id='account-menu'
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        horizontal: 'right',
                        vertical: 'top'
                    }}
                    transformOrigin={{
                        horizontal: 'right',
                        vertical: 'top'
                    }}
                    keepMounted
                    open={isLoading || Boolean(anchorEl)}
                    onClose={onMenuClose}
                    classes={{ paper: styles.menuPaper }}
                >
                    <MenuItem disabled={isLoading}>
                        <Link
                            to={`/users/${user.id}`}
                            component={RouterLink}
                            className={styles.menuLink}
                        >
                            My Profile
                        </Link>
                    </MenuItem>
                    <MenuItem
                        disabled={isLoading}
                        onClick={onLogOut}
                    >
                        Log Out
                    </MenuItem>
                </Menu>
            </header>
            {
                error && (
                    <Alert
                        severity='error'
                        className={styles.alert}
                    >
                        An error occurred while logging out.<br />
                        Request ended with message &lsquo;{error.message}&rsquo;
                        {
                            error.status && ` and status '${error.status}'`
                        }.
                    </Alert>
                )
            }
        </Fragment>
    );
};

AccountHeader.propTypes = {
    title: PropTypes.string
};

AccountHeader.defaultProps = {
    title: null
};

export default AccountHeader;
