import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import {
    Button, Typography, Link,
    Stepper, Step, StepLabel, StepContent
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Block from '../../../components/Block';
import HistoryStepIcon from './components/HistoryStepIcon';
import { PERIOD_TYPE_MONTH, PERIOD_TYPE_YEAR } from '../../../consts/periodTypes';
import { OP_FETCH_ORDERS, OP_FETCH_GRANTS } from './consts/operationIds';
import { ITEM_ORDER, ITEM_GRANT } from './consts/itemTypes';
import { stableSort, descendingComparator } from '../../../helpers/sort';
import { getSubscriptionEndTimestamp } from '../../../helpers/period';
import { longDateTimeFormat } from '../../../i18n/dateFns';
import styles from './HistoryBlock.module.scss';

const idDescComparator = (a, b) => descendingComparator(a.id, b.id);
const vTimestampDescComparator = (a, b) => descendingComparator(a.v.timestamp, b.v.timestamp);

const getUserFullName = (firstName, lastName) => `${firstName} ${lastName}`;

const getErrorIntroText = (operationId) => {
    const base = 'An error occurred while';
    let opText;

    switch (operationId) {
        case OP_FETCH_ORDERS:
            opText = 'loading orders';
            break;
        case OP_FETCH_GRANTS:
            opText = 'loading grants';
            break;
        default:
            throw new Error(`Operation '${operationId}' is not supported`);
    }

    return `${base} ${opText}.`;
};

const HistoryBlock = ({
    orders,
    grants,
    ordersTotal,
    grantsTotal,
    hideUserLink,
    error,
    onLoadData
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleLoadData = async () => {
        if (!onLoadData) {
            return;
        }

        setIsLoading(true);
        await onLoadData();
        setIsLoading(false);
    };

    let sOrders = orders.slice();
    let sGrants = grants.slice();

    sOrders = stableSort(sOrders, idDescComparator);
    sGrants = stableSort(sGrants, idDescComparator);

    const soItems = sOrders.map((o) => ({ v: o, type: ITEM_ORDER }));
    const sgItems = sGrants.map((g) => ({ v: g, type: ITEM_GRANT }));

    let history = soItems.concat(sgItems);
    history = stableSort(history, vTimestampDescComparator);

    return (
        <Block>
            {
                error && (
                    <Alert
                        severity='error'
                        className={styles.alert}
                    >
                        {getErrorIntroText(error.operationId)}<br />
                        Request ended with message &lsquo;{error.message}&rsquo;
                        {
                            error.status && ` and status '${error.status}'`
                        }.
                    </Alert>
                )
            }
            <Stepper
                orientation='vertical'
                className={styles.stepper}
            >
                {
                    history.map(({ v, type }) => {
                        const expiresAt = v.endTimestamp || getSubscriptionEndTimestamp(
                            v.timestamp,
                            v.subscription.periodType,
                            v.subscription.periods
                        );

                        return (
                            <Step
                                key={`${v.id}${type}`}
                                expanded
                                active
                                completed
                            >
                                <StepLabel
                                    StepIconComponent={() => (
                                        <HistoryStepIcon
                                            color='disabled'
                                            itemType={type}
                                            className={styles.stepIcon}
                                        />
                                    )}
                                >
                                    {format(v.timestamp, longDateTimeFormat)}
                                </StepLabel>
                                <StepContent>
                                    {
                                        type === ITEM_GRANT
                                        && v.committer
                                        && (
                                            <Typography
                                                variant='body2'
                                                gutterBottom
                                            >
                                                by&nbsp;
                                                {
                                                    hideUserLink
                                                        ? getUserFullName(
                                                            v.committer.firstName,
                                                            v.committer.lastName
                                                        )
                                                        : (
                                                            <Link
                                                                to={`/users/${v.committer.id}`}
                                                                component={RouterLink}
                                                            >
                                                                {
                                                                    getUserFullName(
                                                                        v.committer.firstName,
                                                                        v.committer.lastName
                                                                    )
                                                                }
                                                            </Link>
                                                        )
                                                }
                                            </Typography>
                                        )
                                    }
                                    <Typography
                                        variant='body2'
                                        gutterBottom
                                    >
                                        <Link
                                            to={`/subscriptions/${v.subscription.id}`}
                                            component={RouterLink}
                                        >
                                            {v.subscription.name}
                                        </Link>
                                        {
                                            type === ITEM_ORDER && (
                                                ` - $${v.subscription.price}`
                                            )
                                        }
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        color='textSecondary'
                                    >
                                        Expires at {format(expiresAt, longDateTimeFormat)}
                                    </Typography>
                                </StepContent>
                            </Step>
                        );
                    })
                }
            </Stepper>
            {
                orders.length + grants.length < ordersTotal + grantsTotal
                    ? (
                        <div className={styles.actionsBlock}>
                            <Button
                                type='button'
                                variant='contained'
                                color='primary'
                                disabled={isLoading}
                                onClick={handleLoadData}
                            >
                                More
                            </Button>
                        </div>
                    )
                    : null
            }
        </Block>
    );
};

HistoryBlock.propTypes = {
    orders: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        subscription: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            periodType: PropTypes.oneOf([
                PERIOD_TYPE_MONTH,
                PERIOD_TYPE_YEAR
            ]).isRequired,
            periods: PropTypes.number.isRequired,
            endTimestamp: PropTypes.instanceOf(Date)
        }).isRequired,
        timestamp: PropTypes.instanceOf(Date).isRequired
    })).isRequired,
    grants: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        subscription: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            periodType: PropTypes.oneOf([
                PERIOD_TYPE_MONTH,
                PERIOD_TYPE_YEAR
            ]).isRequired,
            periods: PropTypes.number.isRequired,
            endTimestamp: PropTypes.instanceOf(Date)
        }).isRequired,
        committer: PropTypes.shape({
            id: PropTypes.number.isRequired,
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired
        }),
        timestamp: PropTypes.instanceOf(Date).isRequired,
        endTimestamp: PropTypes.instanceOf(Date)
    })).isRequired,
    ordersTotal: PropTypes.number.isRequired,
    grantsTotal: PropTypes.number.isRequired,
    hideUserLink: PropTypes.bool,
    error: PropTypes.exact({
        status: PropTypes.number,
        message: PropTypes.string,
        operationId: PropTypes.oneOf([
            OP_FETCH_ORDERS,
            OP_FETCH_GRANTS
        ]).isRequired
    }),
    onLoadData: PropTypes.func
};

HistoryBlock.defaultProps = {
    hideUserLink: false,
    error: null,
    onLoadData: null
};

export default HistoryBlock;
