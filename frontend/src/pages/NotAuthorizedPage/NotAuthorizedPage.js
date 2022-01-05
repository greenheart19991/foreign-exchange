import React, { Fragment } from 'react';
import { Alert } from '@material-ui/lab';
import AccountHeader from '../../domain/Account/AccountHeader';

const NotAuthorizedPage = () => (
    <Fragment>
        <AccountHeader />
        <Alert severity='error'>
            You are forbidden to view requested page.
        </Alert>
    </Fragment>
);

export default NotAuthorizedPage;
