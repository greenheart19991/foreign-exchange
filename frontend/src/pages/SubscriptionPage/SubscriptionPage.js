import React, { Fragment, useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Loader from '../../components/Loader';
import AccountHeader from '../../domain/Account/AccountHeader';
import SubscriptionBlock from '../../domain/Subscription/SubscriptionBlock';
import { getAPIResponseErrorSummary } from '../../helpers/api';
import api from '../../services/api';
import styles from './SubscriptionPage.module.scss';

const SubscriptionPage = () => {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const [subscription, setSubscription] = useState(null);

    const [initError, setInitError] = useState(null);
    const [createError, setCreateError] = useState(null);

    const params = useParams();
    const history = useHistory();

    const subscriptionBlockFormikRef = useRef(null);

    const subscriptionId = 'id' in params
        ? parseInt(params.id, 0)
        : null;

    const isNew = subscriptionId === null;

    const loadSubscription = async () => {
        const fetchedSubscription = await api.subscription.get(subscriptionId);
        setSubscription(fetchedSubscription);
    };

    const resetPageState = () => {
        setIsPageLoading(true);
        setInitError(null);

        setSubscription(null);

        setIsCreating(false);
        setCreateError(null);
    };

    useEffect(() => {
        resetPageState();

        const pLoadData = isNew
            ? Promise.resolve()
            : loadSubscription()
                .catch((e) => {
                    const { status, message } = getAPIResponseErrorSummary(e);

                    setInitError({
                        status,
                        message
                    });
                });

        pLoadData.then(() => (
            setIsPageLoading(false)
        ));
    }, [subscriptionId]);

    const onCreate = async () => {
        const form = subscriptionBlockFormikRef.current;

        const formErrors = await form.validateForm();
        if (Object.keys(formErrors).length !== 0) {
            form.setTouched(formErrors, false);
            return;
        }

        setCreateError(null);

        setIsCreating(true);
        form.setSubmitting(true);

        const {
            name,
            periodType,
            periods,
            requests,
            price,
            startTimestamp,
            endTimestamp
        } = form.values;

        const sValues = {
            name,
            periodType,
            periods,
            requests,
            price
        };

        if (startTimestamp !== null) {
            sValues.startTimestamp = startTimestamp;
        }

        if (endTimestamp !== null) {
            sValues.endTimestamp = endTimestamp;
        }

        let createdSubscription;

        try {
            createdSubscription = await api.subscription.create(sValues);
        } catch (e) {
            const { status, message } = getAPIResponseErrorSummary(e);

            setCreateError({
                status,
                message
            });

            setIsCreating(false);
            form.setSubmitting(false);

            return;
        }

        history.push(`/subscriptions/${createdSubscription.id}`);
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
                    initError.status === 403
                        ? (
                            <Alert severity='error'>
                                You are forbidden to view requested page.
                            </Alert>
                        )
                        : (
                            <Alert severity='error'>
                                An error occurred while loading subscription.<br />
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
        ? 'New Subscription'
        : subscription.name;

    return (
        <Fragment>
            <AccountHeader title={title} />
            {
                createError && (
                    <Alert
                        severity='error'
                        className={styles.errorBlock}
                    >
                        An error occurred while creating subscription.<br />
                        Request ended with message &lsquo;{createError.message}&rsquo;
                        {
                            createError.status && ` and status '${createError.status}'`
                        }.
                    </Alert>
                )
            }
            <SubscriptionBlock
                readOnly={!isNew}
                subscription={subscription}
                formikRef={subscriptionBlockFormikRef}
            />
            {
                isNew && (
                    <div className={styles.actionsBlock}>
                        <Button
                            type='button'
                            variant='contained'
                            color='primary'
                            disabled={isCreating}
                            onClick={onCreate}
                        >
                            Create Subscription
                        </Button>
                    </div>
                )
            }
        </Fragment>
    );
};

export default SubscriptionPage;
