import React, { Fragment } from 'react';
import AccountHeader from '../../domain/Account/AccountHeader';
import SubscriptionsBlock from '../../domain/Subscription/SubscriptionsBlock';

const SubscriptionsPage = () => (
    <Fragment>
        <AccountHeader title='Subscriptions' />
        <SubscriptionsBlock />
    </Fragment>
);

export default SubscriptionsPage;
