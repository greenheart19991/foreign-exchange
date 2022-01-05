import React, { Fragment } from 'react';
import AccountHeader from '../../domain/Account/AccountHeader';
import UsersBlock from '../../domain/User/UsersBlock';

const UsersPage = () => (
    <Fragment>
        <AccountHeader title='Users' />
        <UsersBlock />
    </Fragment>
);

export default UsersPage;
