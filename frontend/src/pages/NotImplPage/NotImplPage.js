import React, { Fragment } from 'react';
import { Typography } from '@material-ui/core';
import AccountHeader from '../../domain/Account/AccountHeader';

const NotImplPage = () => (
    <Fragment>
        <AccountHeader title='Not implemented.' />
        <Typography>It&apos;s a temporary page.</Typography>
        <Typography>Functionality will be implemented soon.</Typography>
    </Fragment>
);

export default NotImplPage;
