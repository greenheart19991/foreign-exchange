import React, { Fragment } from 'react';
import { Typography } from '@material-ui/core';
import AccountHeader from '../../domain/Account/AccountHeader';

const NotFoundPage = () => (
    <Fragment>
        <AccountHeader title='Page not found.' />
        <Typography>It&apos;s strange.</Typography>
        <Typography>Hmm, how did you get there?</Typography>
    </Fragment>
);

export default NotFoundPage;
