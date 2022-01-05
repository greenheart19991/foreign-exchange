import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Paper, Grid, Tab } from '@material-ui/core';
import { Alert, TabContext, TabList, TabPanel } from '@material-ui/lab';
import Block from '../../../components/Block';
import OfferCard from './components/OfferCard';
import { PERIOD_TYPE_MONTH, PERIOD_TYPE_YEAR } from '../../../consts/periodTypes';
import {
    stableSort, ascendingComparator,
    createComparatorFromOrder
} from '../../../helpers/sort';
import styles from './OffersBlock.module.scss';

// tab ids

const T_MONTH = 'T_MONTH';
const T_YEAR = 'T_YEAR';
const T_OTHER = 'T_OTHER';

const tabIdsAscOrder = [
    T_MONTH,
    T_YEAR,
    T_OTHER
];

const tabLabels = {
    [T_MONTH]: 'Month',
    [T_YEAR]: 'Year',
    [T_OTHER]: 'Other'
};

const nameAscComparator = (a, b) => ascendingComparator(a.name, b.name);
const priceAscComparator = (a, b) => ascendingComparator(a.price, b.price);

const tabIdsAscComparator = createComparatorFromOrder(tabIdsAscOrder);

const getTabId = (subscription) => {
    const { periodType, periods } = subscription;

    if (periodType === PERIOD_TYPE_MONTH) {
        if (periods === 1) {
            return T_MONTH;
        }

        if (periods % 12 === 0) {
            return T_YEAR;
        }

        return T_OTHER;
    }

    if (periodType === PERIOD_TYPE_YEAR) {
        return T_YEAR;
    }

    return T_OTHER;
};

const OffersBlock = ({
    subscriptions,
    error,
    onCreateOrder
}) => {
    const [tabId, setTabId] = useState(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);

    const handleTabChange = (e, v) => {
        setTabId(v);
    };

    const handleCreateOrder = async (subscription) => {
        if (!onCreateOrder) {
            return;
        }

        setIsCreatingOrder(true);
        await onCreateOrder(subscription);
        setIsCreatingOrder(false);
    };

    const renderCards = (sArr, now) => (
        <Grid
            container
            className={styles.gridContainer}
        >
            {
                sArr.map((s) => {
                    const isArchived = s.endTimestamp !== null && s.endTimestamp <= now;
                    const isUnpublished = s.startTimestamp > now;

                    return (
                        <Grid
                            key={s.id}
                            item
                            className={styles.gridItem}
                        >
                            <OfferCard
                                subscription={s}
                                disabled={isCreatingOrder || isArchived || isUnpublished}
                                onCreateOrder={() => handleCreateOrder(s)}
                            />
                        </Grid>
                    );
                })
            }
        </Grid>
    );

    let sSubscriptions = stableSort(subscriptions, nameAscComparator);
    sSubscriptions = stableSort(sSubscriptions, priceAscComparator);

    const subsByTab = sSubscriptions.reduce((acc, s) => {
        const id = getTabId(s);

        if (acc[id]) {
            acc[id].push(s);
        } else {
            acc[id] = [s];
        }

        return acc;
    }, {});

    const tabs = Object
        .keys(subsByTab)
        .sort(tabIdsAscComparator)
        .map((id) => ({
            id,
            label: tabLabels[id]
        }));

    useEffect(() => {
        const defaultTabId = tabs.length > 0
            ? tabs[0].id
            : null;

        if (defaultTabId !== tabId) {
            setTabId(defaultTabId);
        }
    }, [subscriptions]);

    const now = new Date();

    return (
        <Block>
            {
                error && (
                    <Alert
                        severity='error'
                        className={styles.errorBlock}
                    >
                        An error occurred while creating order.<br />
                        Request ended with message &lsquo;{error.message}&rsquo;
                        {
                            error.status && ` and status '${error.status}'`
                        }.
                    </Alert>
                )
            }
            {
                subscriptions.length === 0
                    ? (
                        <Alert severity='warning'>
                            Subscriptions not found.
                        </Alert>
                    )
                    : (
                        <Paper
                            variant='outlined'
                            className={
                                clsx(
                                    styles.subsPaper,
                                    { [styles.noTabs]: tabs.length <= 1 }
                                )
                            }
                        >
                            {
                                tabs.length > 1
                                && tabId !== null
                                && (
                                    <TabContext value={tabId}>
                                        <TabList
                                            aria-label='category tabs'
                                            className={styles.tabList}
                                            onChange={handleTabChange}
                                        >
                                            {
                                                tabs.map(({ id, label }) => (
                                                    <Tab
                                                        key={id}
                                                        value={id}
                                                        label={label}
                                                    />
                                                ))
                                            }
                                        </TabList>
                                        {
                                            tabs.map(({ id }) => (
                                                <TabPanel
                                                    key={id}
                                                    value={id}
                                                    className={styles.tabPanel}
                                                >
                                                    {renderCards(subsByTab[id], now)}
                                                </TabPanel>
                                            ))
                                        }
                                    </TabContext>
                                )
                            }
                            {
                                tabs.length === 1
                                && renderCards(subsByTab[tabs[0].id], now)
                            }
                        </Paper>
                    )
            }
        </Block>
    );
};

OffersBlock.propTypes = {
    subscriptions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        periodType: PropTypes.oneOf([
            PERIOD_TYPE_MONTH,
            PERIOD_TYPE_YEAR
        ]).isRequired,
        periods: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        requests: PropTypes.number.isRequired,
        startTimestamp: PropTypes.instanceOf(Date).isRequired,
        endTimestamp: PropTypes.instanceOf(Date)
    })).isRequired,
    error: PropTypes.exact({
        status: PropTypes.number,
        message: PropTypes.string
    }),
    onCreateOrder: PropTypes.func
};

OffersBlock.defaultProps = {
    error: null,
    onCreateOrder: null
};

export default OffersBlock;
