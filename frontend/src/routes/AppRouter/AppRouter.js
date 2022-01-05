import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Paper, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Loader from '../../components/Loader';
import PrivateRoute from '../../components/PrivateRoute';
import AccountRouter from '../AccountRouter';
import { useAuthContext } from '../../context/AuthContext';
import { getAPIResponseErrorSummary } from '../../helpers/api';
import styles from './AppRouter.module.scss';

import LoginPage from '../../pages/LoginPage';
import SignupPage from '../../pages/SignupPage';

const AppRouter = () => {
    const {
        error,
        isLoading,
        loaded,
        loadCurrentUser
    } = useAuthContext();

    useEffect(() => {
        loadCurrentUser();
    }, []);

    if (!loaded || isLoading) {
        return (
            <Loader />
        );
    }

    if (error) {
        // An error can be caused by issues related to:
        // 1) internet connection (--> status === null);
        // 2) backend deployment (e.g. lost connection to db --> status === 500);
        // 3) backend high load (e.g. if backend cannot handle the request in time
        // while is placed behind proxy - proxy will return 504);
        // 4) etc.
        // These errors are not programming or data errors,
        // but rather just circumstances. That's why we need to add
        // 'Retry' button.

        const { status, message } = getAPIResponseErrorSummary(error);

        if (status !== 401) {
            return (
                <div className={styles.page}>
                    <Paper className={styles.container}>
                        <Alert
                            severity='error'
                            className={styles.alert}
                        >
                            An error occurred while loading session data.<br />
                            Request ended with message &lsquo;{message}&rsquo;
                            {
                                status && ` and status '${status}'`
                            }.
                        </Alert>
                        <Button
                            type='button'
                            variant='contained'
                            color='primary'
                            onClick={loadCurrentUser}
                        >
                            Retry
                        </Button>
                    </Paper>
                </div>
            );
        }
    }

    return (
        <Switch>
            <Route exact path='/login' component={LoginPage} />
            <Route exact path='/signup' component={SignupPage} />
            <PrivateRoute path='/' component={AccountRouter} />
        </Switch>
    );
};

export default AppRouter;
