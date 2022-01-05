import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import AccountLayout from '../../domain/Account/AccountLayout';
import { createAuthorizationController } from '../../components/AuthorizationController';
import createOrComposer from '../../hocs/or';
import { hasRole } from '../../hocs/authorization';
import { userRouteIsMe as isMe } from './hocs/authorization';
import { ROLE_USER, ROLE_ADMIN } from '../../consts/roles';

import UsersPage from '../../pages/UsersPage';
import SubscriptionsPage from '../../pages/SubscriptionsPage';
import UserPage from '../../pages/UserPage';
import SubscriptionPage from '../../pages/SubscriptionPage';
import OffersPage from '../../pages/OffersPage';
import NotFoundPage from '../../pages/NotFoundPage';
import NotAuthorizedPage from '../../pages/NotAuthorizedPage';

const ACUsersPage = createAuthorizationController(UsersPage, NotAuthorizedPage);
const ACUserPage = createAuthorizationController(UserPage, NotAuthorizedPage);
const ACSubscriptionsPage = createAuthorizationController(SubscriptionsPage, NotAuthorizedPage);
const ACSubscriptionPage = createAuthorizationController(SubscriptionPage, NotAuthorizedPage);
const ACOffersPage = createAuthorizationController(OffersPage, NotAuthorizedPage);

// route components

const RCUsers = hasRole([ROLE_ADMIN])(ACUsersPage);
const RCNewUser = hasRole([ROLE_ADMIN])(ACUserPage);
const RCSubscriptions = hasRole([ROLE_ADMIN])(ACSubscriptionsPage);
const RCNewSubscription = hasRole([ROLE_ADMIN])(ACSubscriptionPage);
const RCOffers = hasRole([ROLE_USER])(ACOffersPage);

const composeOr = createOrComposer('acc', 'isAuthorized');

const RCUser = composeOr(
    hasRole([ROLE_ADMIN]),
    isMe
)(ACUserPage);

const AccountRouter = () => {
    const { user } = useAuthContext();

    return (
        <AccountLayout>
            <Switch>
                <Route exact path='/users' component={RCUsers} />
                <Route exact path='/users/new' component={RCNewUser} />
                <Route exact path='/users/:id' component={RCUser} />
                <Route exact path='/subscriptions' component={RCSubscriptions} />
                <Route exact path='/subscriptions/new' component={RCNewSubscription} />
                <Route exact path='/subscriptions/:id' component={SubscriptionPage} />
                <Route exact path='/offers' component={RCOffers} />

                <Redirect exact from='/' to={`/users/${user.id}`} />
                <Route component={NotFoundPage} />
            </Switch>
        </AccountLayout>
    );
};

export default AccountRouter;
