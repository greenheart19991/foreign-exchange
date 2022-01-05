import React, { Fragment, useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { omit } from 'lodash-es';
import { Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Switch from '../../components/Switch';
import Loader from '../../components/Loader';
import AccountHeader from '../../domain/Account/AccountHeader';
import UserBlock from '../../domain/User/UserBlock';
import GrantBlock from '../../domain/User/GrantBlock';
import KeyBlock from '../../domain/User/KeyBlock';
import UsageBlock from '../../domain/User/UsageBlock';
import HistoryBlock from '../../domain/User/HistoryBlock';
import { useAuthContext } from '../../context/AuthContext';
import { ROLE_USER } from '../../consts/roles';
import { SORT_ASC, SORT_DESC } from '../../consts/sort';
import { PAG_LIMIT, PAG_API_MAX_LIMIT } from '../../consts/pagination';
import {
    OP_FETCH_ORDERS as HB_OP_FETCH_ORDERS,
    OP_FETCH_GRANTS as HB_OP_FETCH_GRANTS
} from '../../domain/User/HistoryBlock/consts/operationIds';
import { stableSort, descendingComparator } from '../../helpers/sort';
import { getSubscriptionEndTimestamp } from '../../helpers/period';
import { getAPIResponseErrorSummary } from '../../helpers/api';
import { addId } from '../../helpers/promise';
import api from '../../services/api';
import styles from './UserPage.module.scss';

// fetcher identifiers

const F_USER = 'F_USER';
const F_ORDERS = 'F_ORDERS';
const F_GRANTS = 'F_GRANTS';
const F_KEY = 'F_KEY';
const F_USAGE = 'F_USAGE';
const F_AV_SUBSCRIPTIONS = 'F_AV_SUBSCRIPTIONS';

// operations

const OP_UPDATE_IS_ACTIVE = 'OP_UPDATE_IS_ACTIVE';
const OP_CREATE_USER = 'OP_CREATE_USER';
const OP_CREATE_GRANT = 'OP_CREATE_GRANT';
const OP_FETCH_ORDERS = 'OP_FETCH_ORDERS';
const OP_FETCH_GRANTS = 'OP_FETCH_GRANTS';
const OP_FETCH_USAGE = 'OP_FETCH_USAGE';
const OP_DELETE_USER = 'OP_DELETE_USER';

const opToHistoryBlockOpMap = {
    OP_FETCH_ORDERS: HB_OP_FETCH_ORDERS,
    OP_FETCH_GRANTS: HB_OP_FETCH_GRANTS
};

const fToOpMap = {
    F_ORDERS: OP_FETCH_ORDERS,
    F_GRANTS: OP_FETCH_GRANTS,
    F_USAGE: OP_FETCH_USAGE
};

// history arr item types

const ITEM_ORDER = 'ITEM_ORDER';
const ITEM_GRANT = 'ITEM_GRANT';

const vTimestampDescComparator = (a, b) => descendingComparator(a.v.timestamp, b.v.timestamp);

const getInitErrorIntroText = (fetcherId) => {
    const base = 'An error occurred while loading';
    let fetcherText;

    switch (fetcherId) {
        case F_USER:
            fetcherText = 'user data';
            break;
        case F_ORDERS:
            fetcherText = 'orders';
            break;
        case F_GRANTS:
            fetcherText = 'grants';
            break;
        case F_KEY:
            fetcherText = 'key';
            break;
        case F_USAGE:
            fetcherText = 'usage data';
            break;
        case F_AV_SUBSCRIPTIONS:
            fetcherText = 'subscriptions';
            break;
        default:
            throw new Error(`Fetcher '${fetcherId}' is not supported`);
    }

    return `${base} ${fetcherText}.`;
};

const getPageErrorIntroText = (operationId) => {
    const base = 'An error occurred while';
    let opText;

    switch (operationId) {
        case OP_UPDATE_IS_ACTIVE:
            opText = 'updating user status';
            break;
        case OP_CREATE_USER:
            opText = 'creating user';
            break;
        case OP_CREATE_GRANT:
            opText = 'creating grant';
            break;
        case OP_FETCH_ORDERS:
            opText = 'loading orders';
            break;
        case OP_FETCH_GRANTS:
            opText = 'loading grants';
            break;
        case OP_FETCH_USAGE:
            opText = 'loading usage data';
            break;
        case OP_DELETE_USER:
            opText = 'deleting user';
            break;
        default:
            throw new Error(`Operation '${operationId}' is not supported`);
    }

    return `${base} ${opText}.`;
};

const UserPage = () => {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isActiveLoading, setIsActiveLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [user, setUser] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const [avSubscriptions, setAvSubscriptions] = useState([]);
    const [orders, setOrders] = useState([]);
    const [grants, setGrants] = useState([]);
    const [key, setKey] = useState(null);
    const [usage, setUsage] = useState(null);

    const [ordersTotal, setOrdersTotal] = useState(0);
    const [grantsTotal, setGrantsTotal] = useState(0);

    const [initError, setInitError] = useState(null);
    const [pageError, setPageError] = useState(null);
    const [userBlockError, setUserBlockError] = useState(null);
    const [grantBlockError, setGrantBlockError] = useState(null);
    const [keyBlockError, setKeyBlockError] = useState(null);
    const [historyBlockError, setHistoryBlockError] = useState(null);

    const params = useParams();
    const history = useHistory();

    const {
        user: sessionUser,
        setUser: setSessionUser
    } = useAuthContext();

    const userBlockFormikRef = useRef(null);
    const grantBlockFormikRef = useRef(null);

    const userId = 'id' in params
        ? parseInt(params.id, 0)
        : null;

    const isNew = userId === null;
    const isSelfProfile = userId === sessionUser.id;

    const fetchUser = async () => {
        const { subscription, ...fetchedUser } = await api.user.get(userId);
        return fetchedUser;
    };

    const fetchKey = async () => {
        let fetchedKey = null;

        try {
            const ko = await api.key.get(userId);
            fetchedKey = ko.key;
        } catch (e) {
            const { status } = getAPIResponseErrorSummary(e);
            if (status !== 404) {
                throw e;
            }
        }

        return fetchedKey;
    };

    const fetchUsage = () => api.usage.get(userId);

    const fetchOrders = ({ limit, offset }) => api.order.list({
        where: { userId },
        sort: [
            ['timestamp', SORT_DESC],
            ['id', SORT_DESC]
        ],
        limit,
        offset
    });

    const fetchGrants = ({ limit, offset }) => api.grant.list({
        where: {
            recipientId: userId
        },
        sort: [
            ['timestamp', SORT_DESC],
            ['id', SORT_DESC]
        ],
        limit,
        offset
    });

    const fetchHistoryItems = async ({
        limit,
        ordersOffset,
        grantsOffset
    }) => {
        const pFetchOrders = addId(fetchOrders({
            limit,
            offset: ordersOffset
        }), F_ORDERS);

        const pFetchGrants = addId(fetchGrants({
            limit,
            offset: grantsOffset
        }), F_GRANTS);

        const promises = [pFetchOrders, pFetchGrants];

        const [
            { results: fetchedOrders, count: fetchedOrdersTotal },
            { results: fetchedGrants, count: fetchedGrantsTotal }
        ] = await Promise.all(promises);

        const foItems = fetchedOrders.map((v) => ({ v, type: ITEM_ORDER }));
        const fgItems = fetchedGrants.map((v) => ({ v, type: ITEM_GRANT }));

        let items = foItems.concat(fgItems);
        items = stableSort(items, vTimestampDescComparator);
        items = items.slice(0, limit);

        const includedOrders = items
            .filter(({ type }) => type === ITEM_ORDER)
            .map(({ v }) => v);

        const includedGrants = items
            .filter(({ type }) => type === ITEM_GRANT)
            .map(({ v }) => v);

        return {
            orders: includedOrders,
            grants: includedGrants,
            ordersTotal: fetchedOrdersTotal,
            grantsTotal: fetchedGrantsTotal
        };
    };

    const fetchAvSubscriptions = async () => {
        const now = new Date();
        const listParams = {
            unpublished: false,
            where: {
                endTimestamp: {
                    $or: [
                        { $is: null },
                        { $gt: now }
                    ]
                }
            },
            sort: [['id', SORT_ASC]],
            limit: PAG_API_MAX_LIMIT
        };

        const data = await api.subscription.list(listParams);

        const total = data.count;
        let acc = data.results;

        if (total > PAG_API_MAX_LIMIT) {
            const promises = [];

            for (let i = PAG_API_MAX_LIMIT; i < total; i += PAG_API_MAX_LIMIT) {
                const promise = api.subscription.list({
                    ...listParams,
                    offset: i
                });

                promises.push(promise);
            }

            const dataArr = await Promise.all(promises);
            const subsArr = dataArr.map(({ results }) => results);

            acc = acc.concat(subsArr);
        }

        return acc;
    };

    const loadInitData = async () => {
        if (!isNew) {
            const pFetchUser = addId(fetchUser(), F_USER);
            const pFetchKey = isSelfProfile
                ? addId(fetchKey(), F_KEY)
                : null;

            const pFetchHistoryItems = fetchHistoryItems({
                limit: PAG_LIMIT,
                ordersOffset: 0,
                grantsOffset: 0
            });

            const promises = [pFetchUser, pFetchKey, pFetchHistoryItems];

            const [
                fetchedUser,
                fetchedKey,
                {
                    orders: fetchedOrders,
                    grants: fetchedGrants,
                    ordersTotal: fetchedOrdersTotal,
                    grantsTotal: fetchedGrantsTotal
                }
            ] = await Promise.all(promises);

            setUser(fetchedUser);
            setIsActive(fetchedUser.isActive);
            setKey(fetchedKey);

            setOrders(fetchedOrders);
            setGrants(fetchedGrants);
            setOrdersTotal(fetchedOrdersTotal);
            setGrantsTotal(fetchedGrantsTotal);

            const lastOrder = fetchedOrders[0];
            const lastGrant = fetchedGrants[0];

            let last = null;

            if (lastOrder && lastGrant) {
                last = lastOrder.timestamp >= lastGrant.timestamp
                    ? lastOrder
                    : lastGrant;
            } else if (lastOrder) {
                last = lastOrder;
            } else if (lastGrant) {
                last = lastGrant;
            }

            if (last !== null) {
                const now = new Date();
                const expiresAt = last.endTimestamp || getSubscriptionEndTimestamp(
                    last.timestamp,
                    last.subscription.periodType,
                    last.subscription.periods
                );

                // user has subscription

                if (expiresAt > now) {
                    const pFetchUsage = addId(fetchUsage(), F_USAGE);
                    const fetchedUsage = await pFetchUsage;

                    setUsage(fetchedUsage);
                }
            }
        }

        if (!isSelfProfile) {
            const pFetchAvSubscriptions = addId(fetchAvSubscriptions(), F_AV_SUBSCRIPTIONS);
            const fetchedAvSubscriptions = await pFetchAvSubscriptions;

            setAvSubscriptions(fetchedAvSubscriptions);
        }
    };

    const resetPageState = () => {
        setIsPageLoading(true);
        setInitError(null);

        setIsActiveLoading(false);
        setIsCreating(false);
        setIsDeleting(false);

        setUser(null);
        setIsActive(true);
        setAvSubscriptions([]);
        setOrders([]);
        setGrants([]);
        setKey(null);
        setUsage(null);

        setOrdersTotal(0);
        setGrantsTotal(0);

        setPageError(null);
        setUserBlockError(null);
        setGrantBlockError(null);
        setKeyBlockError(null);
        setHistoryBlockError(null);
    };

    useEffect(() => {
        resetPageState();

        loadInitData()
            .catch(({ error, id }) => {
                const { status, message } = getAPIResponseErrorSummary(error);

                setInitError({
                    status,
                    message,
                    fetcherId: id
                });
            })
            .then(() => setIsPageLoading(false));
    }, [userId]);

    const onIsActiveChange = async (ev) => {
        const v = ev.target.checked;

        if (isNew) {
            setIsActive(v);
            return;
        }

        setIsActiveLoading(true);
        setPageError(null);

        try {
            await api.user.patch(userId, { isActive: v });

            setIsActive(v);
            setUser({
                ...user,
                isActive: v
            });
        } catch (e) {
            const { status, message } = getAPIResponseErrorSummary(e);

            setPageError({
                status,
                message,
                operationId: OP_UPDATE_IS_ACTIVE
            });
        }

        setIsActiveLoading(false);
    };

    const onCreateUser = async () => {
        const userForm = userBlockFormikRef.current;
        const grantForm = grantBlockFormikRef.current;

        const userFormErrors = await userForm.validateForm();
        if (Object.keys(userFormErrors).length !== 0) {
            userForm.setTouched(userFormErrors, false);
            return;
        }

        const grantFormErrors = await grantForm.validateForm();
        if (Object.keys(grantFormErrors).length !== 0) {
            grantForm.setTouched(grantFormErrors, false);
            return;
        }

        setPageError(null);

        setIsCreating(true);
        userForm.setSubmitting(true);
        grantForm.setSubmitting(true);

        const uValues = omit(userForm.values, ['confirmPassword']);
        uValues.isActive = isActive;

        let createdUser;

        try {
            createdUser = await api.user.create(uValues);
        } catch (e) {
            const { status, message } = getAPIResponseErrorSummary(e);

            setPageError({
                status,
                message,
                operationId: OP_CREATE_USER
            });

            setIsCreating(false);
            userForm.setSubmitting(false);
            grantForm.setSubmitting(false);

            return;
        }

        const { subscriptionId, endTimestamp } = grantForm.values;

        if (subscriptionId !== '') {
            const gValues = {
                subscriptionId,
                recipientId: createdUser.id
            };

            if (endTimestamp !== null) {
                gValues.endTimestamp = endTimestamp;
            }

            try {
                await api.grant.create(gValues);
            } catch (e) {
                const { status, message } = getAPIResponseErrorSummary(e);

                setPageError({
                    status,
                    message,
                    operationId: OP_CREATE_GRANT
                });

                setIsCreating(false);
                userForm.setSubmitting(false);
                grantForm.setSubmitting(false);

                return;
            }
        }

        history.push(`/users/${createdUser.id}`);
    };

    const onUpdateUser = async (values) => {
        setUserBlockError(null);

        const diff = Object
            .entries(values)
            .reduce((acc, [k, v]) => {
                if (
                    (
                        k !== 'password'
                        && k !== 'confirmPassword'
                        && user[k] !== v
                    ) || (
                        k === 'password'
                        && v
                    )
                ) {
                    acc[k] = v;
                }

                return acc;
            }, {});

        if (Object.keys(diff).length === 0) {
            return;
        }

        try {
            await api.user.patch(userId, diff);

            const updatedUser = Object
                .entries(diff)
                .reduce((acc, [k, v]) => {
                    acc[k] = v;
                    return acc;
                }, { ...user });

            setUser(updatedUser);

            if (isSelfProfile) {
                setSessionUser(updatedUser);
            }
        } catch (e) {
            const { status, message } = getAPIResponseErrorSummary(e);

            setUserBlockError({
                status,
                message
            });
        }
    };

    const onGrant = async (values) => {
        setGrantBlockError(null);

        const { subscriptionId, endTimestamp } = values;
        const gValues = {
            subscriptionId,
            recipientId: userId
        };

        if (endTimestamp !== null) {
            gValues.endTimestamp = endTimestamp;
        }

        try {
            await api.grant.create(gValues);
        } catch (e) {
            const { status, message } = getAPIResponseErrorSummary(e);

            setGrantBlockError({
                status,
                message
            });

            return;
        }

        const pFetchHistoryItems = fetchHistoryItems({
            limit: PAG_LIMIT,
            ordersOffset: 0,
            grantsOffset: 0
        });

        const pFetchUsage = addId(fetchUsage(), F_USAGE);

        let fetchedOrders;
        let fetchedGrants;
        let fetchedOrdersTotal;
        let fetchedGrantsTotal;
        let fetchedUsage;

        const promises = [pFetchHistoryItems, pFetchUsage];

        try {
            [
                {
                    orders: fetchedOrders,
                    grants: fetchedGrants,
                    ordersTotal: fetchedOrdersTotal,
                    grantsTotal: fetchedGrantsTotal
                },
                fetchedUsage
            ] = await Promise.all(promises);
        } catch ({ error, id }) {
            const { status, message } = getAPIResponseErrorSummary(error);

            setPageError({
                status,
                message,
                operationId: fToOpMap[id]
            });

            return;
        }

        setOrders(fetchedOrders);
        setGrants(fetchedGrants);
        setOrdersTotal(fetchedOrdersTotal);
        setGrantsTotal(fetchedGrantsTotal);

        setUsage(fetchedUsage);
    };

    const onCreateKey = async () => {
        setKeyBlockError(null);

        try {
            const { key: createdKey } = await api.key.create({ userId });
            setKey(createdKey);
        } catch (e) {
            const { status, message } = getAPIResponseErrorSummary(e);

            setKeyBlockError({
                status,
                message
            });
        }
    };

    const onDeleteKey = async () => {
        setKeyBlockError(null);

        try {
            await api.key.remove(userId);
        } catch (e) {
            const { status, message } = getAPIResponseErrorSummary(e);

            setKeyBlockError({
                status,
                message
            });

            return;
        }

        setKey(null);
    };

    const onLoadHistory = async () => {
        setHistoryBlockError(null);

        let fetchedOrders;
        let fetchedGrants;
        let fetchedOrdersTotal;
        let fetchedGrantsTotal;

        try {
            ({
                orders: fetchedOrders,
                grants: fetchedGrants,
                ordersTotal: fetchedOrdersTotal,
                grantsTotal: fetchedGrantsTotal
            } = await fetchHistoryItems({
                limit: PAG_LIMIT,
                ordersOffset: orders.length,
                grantsOffset: grants.length
            }));
        } catch ({ error, id }) {
            const { status, message } = getAPIResponseErrorSummary(error);

            const opId = fToOpMap[id];
            const gbOpId = opToHistoryBlockOpMap[opId];

            setHistoryBlockError({
                status,
                message,
                operationId: gbOpId
            });

            return;
        }

        if (fetchedOrders.length) {
            const concatenated = orders.concat(fetchedOrders);
            setOrders(concatenated);
        }

        if (fetchedGrants.length) {
            const concatenated = grants.concat(fetchedGrants);
            setGrants(concatenated);
        }

        setOrdersTotal(fetchedOrdersTotal);
        setGrantsTotal(fetchedGrantsTotal);
    };

    const onDeleteUser = async () => {
        setPageError(null);
        setIsDeleting(true);

        try {
            await api.user.remove(userId);
        } catch (e) {
            const { status, message } = getAPIResponseErrorSummary(e);

            setPageError({
                status,
                message,
                operationId: OP_DELETE_USER
            });

            setIsDeleting(false);
            return;
        }

        const nextPath = isSelfProfile
            ? '/login'
            : '/users';

        history.push(nextPath);
    };

    const onCancelEditUser = () => {
        setUserBlockError(null);
    };

    const onCancelEditSubscription = () => {
        setGrantBlockError(null);
    };

    if (isPageLoading) {
        return (
            <Fragment>
                <AccountHeader />
                <Loader className={styles.loader} />
            </Fragment>
        );
    }

    if (initError) {
        return (
            <Fragment>
                <AccountHeader />
                {
                    initError.fetcherId === F_USER
                    && initError.status === 404
                        ? (
                            <Alert severity='warning'>
                                User not found.
                            </Alert>
                        )
                        : (
                            <Alert severity='error'>
                                {getInitErrorIntroText(initError.fetcherId)}<br />
                                Request ended with message &lsquo;{initError.message}&rsquo;
                                {
                                    initError.status && ` and status '${initError.status}'`
                                }.
                            </Alert>
                        )
                }
            </Fragment>
        );
    }

    const title = isNew
        ? 'New User'
        : `${user.firstName} ${user.lastName}`;

    let userSubscription = null;
    let startTimestamp = null;
    let endTimestamp = null;

    const lastOrder = orders[0];
    const lastGrant = grants[0];

    let last = null;

    if (lastOrder && lastGrant) {
        last = lastOrder.timestamp >= lastGrant.timestamp
            ? lastOrder
            : lastGrant;
    } else if (lastOrder) {
        last = lastOrder;
    } else if (lastGrant) {
        last = lastGrant;
    }

    if (last !== null) {
        const now = new Date();
        const expiresAt = last.endTimestamp || getSubscriptionEndTimestamp(
            last.timestamp,
            last.subscription.periodType,
            last.subscription.periods
        );

        // user has subscription

        if (expiresAt > now) {
            userSubscription = last.subscription;
            startTimestamp = last.timestamp;

            if (last.endTimestamp) {
                endTimestamp = last.endTimestamp;
            }
        }
    }

    const subscriptions = avSubscriptions.slice();

    if (userSubscription !== null) {
        const s = avSubscriptions.find(({ id }) => id === userSubscription.id);
        if (!s) {
            subscriptions.push(userSubscription);
        }
    }

    return (
        <Fragment>
            <AccountHeader title={title} />
            {
                pageError && (
                    <Alert
                        severity='error'
                        className={styles.errorBlock}
                    >
                        {getPageErrorIntroText(pageError.operationId)}<br />
                        Request ended with message &lsquo;{pageError.message}&rsquo;
                        {
                            pageError.status && ` and status '${pageError.status}'`
                        }.
                    </Alert>
                )
            }
            <UserBlock
                user={user}
                error={userBlockError}
                withControls={!isNew}
                withEditMode={!isNew}
                canSetRole={!isSelfProfile}
                onSubmit={onUpdateUser}
                onCancelEdit={onCancelEditUser}
                formikRef={userBlockFormikRef}
            />
            {
                !isSelfProfile && (
                    <Switch
                        label='User enabled?'
                        classes={{
                            root: styles.isActiveRoot,
                            label: styles.isActiveLabel
                        }}
                        SwitchProps={{
                            color: 'primary'
                        }}
                        checked={isActive}
                        disabled={isActiveLoading}
                        onChange={onIsActiveChange}
                    />
                )
            }
            {
                !isSelfProfile && (
                    <GrantBlock
                        subscriptionId={
                            userSubscription !== null
                                ? userSubscription.id
                                : null
                        }
                        endTimestamp={endTimestamp}
                        subscriptions={subscriptions}
                        error={grantBlockError}
                        allowedEmpty={isNew}
                        withControls={!isNew}
                        withEditMode={!isNew}
                        onGrant={onGrant}
                        onCancelEdit={onCancelEditSubscription}
                        formikRef={grantBlockFormikRef}
                    />
                )
            }
            {
                isNew && (
                    <div className={styles.actionsBlock}>
                        <Button
                            type='button'
                            variant='contained'
                            color='primary'
                            disabled={isCreating}
                            onClick={onCreateUser}
                        >
                            Create User
                        </Button>
                    </div>
                )
            }
            {
                isSelfProfile && (
                    <KeyBlock
                        userKey={key}
                        error={keyBlockError}
                        onCreate={onCreateKey}
                        onDelete={onDeleteKey}
                    />
                )
            }
            {
                usage && (
                    <UsageBlock
                        startTimestamp={startTimestamp}
                        endTimestamp={endTimestamp}
                        subscription={userSubscription}
                        usage={usage}
                    />
                )
            }
            {
                (ordersTotal > 0 || grantsTotal > 0)
                && (
                    <HistoryBlock
                        orders={orders}
                        grants={grants}
                        ordersTotal={ordersTotal}
                        grantsTotal={grantsTotal}
                        hideUserLink={sessionUser.role === ROLE_USER}
                        error={historyBlockError}
                        onLoadData={onLoadHistory}
                    />
                )
            }
            {
                !isNew
                && !(isSelfProfile && sessionUser.role !== ROLE_USER)
                && (
                    <div className={styles.actionsBlock}>
                        <Button
                            type='button'
                            variant='contained'
                            className={styles.dangerButton}
                            disabled={isDeleting}
                            onClick={onDeleteUser}
                        >
                            Delete { isSelfProfile ? 'Account' : 'User' }
                        </Button>
                    </div>
                )
            }
        </Fragment>
    );
};

export default UserPage;
