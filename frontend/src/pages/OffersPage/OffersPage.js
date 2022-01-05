import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert } from '@material-ui/lab';
import Loader from '../../components/Loader';
import AccountHeader from '../../domain/Account/AccountHeader';
import OffersBlock from '../../domain/Subscription/OffersBlock';
import { useAuthContext } from '../../context/AuthContext';
import { SORT_ASC } from '../../consts/sort';
import { PAG_API_MAX_LIMIT } from '../../consts/pagination';
import { getAPIResponseErrorSummary } from '../../helpers/api';
import api from '../../services/api';
import styles from './OffersPage.module.scss';

const OffersPage = () => {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [avSubscriptions, setAvSubscriptions] = useState([]);

    const [initError, setInitError] = useState(null);
    const [createOrderError, setCreateOrderError] = useState(null);

    const { user } = useAuthContext();
    const history = useHistory();

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
        setIsPageLoading(true);
        setInitError(null);

        try {
            const data = await fetchAvSubscriptions();
            setAvSubscriptions(data);
        } catch (e) {
            const { status, message } = getAPIResponseErrorSummary(e);

            setInitError({
                status,
                message
            });
        }

        setIsPageLoading(false);
    };

    useEffect(() => {
        loadInitData();
    }, []);

    const onCreateOrder = async (subscription) => {
        setCreateOrderError(null);

        try {
            await api.order.create({ subscriptionId: subscription.id });
        } catch (e) {
            const { status, message } = getAPIResponseErrorSummary(e);

            setCreateOrderError({
                status,
                message
            });

            return;
        }

        history.push(`/users/${user.id}`);
    };

    if (isPageLoading) {
        return (
            <Fragment>
                <AccountHeader />
                <Loader className={styles.loader} />
            </Fragment>
        );
    }

    return (
        <Fragment>
            <AccountHeader title='Subscriptions' />
            {
                initError
                    ? (
                        <Alert severity='error'>
                            An error occurred while loading subscriptions.<br />
                            Request ended with message &lsquo;{initError.message}&rsquo;
                            {
                                initError.status && ` and status '${initError.status}'`
                            }.
                        </Alert>
                    )
                    : (
                        <OffersBlock
                            subscriptions={avSubscriptions}
                            error={createOrderError}
                            onCreateOrder={onCreateOrder}
                        />
                    )
            }
        </Fragment>
    );
};

export default OffersPage;
