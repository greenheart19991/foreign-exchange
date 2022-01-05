import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@material-ui/core';
import Block from '../../../components/Block';
import Table from '../../../components/Table';
import { PERIOD_TYPE_MONTH, PERIOD_TYPE_YEAR } from '../../../consts/periodTypes';
import {
    addPeriods, getPeriodsCount,
    getSubscriptionEndTimestamp
} from '../../../helpers/period';
import { shortDateTimeFormat } from '../../../i18n/dateFns';
import styles from './UsageBlock.module.scss';

const UsageBlock = (props) => {
    const cells = [
        {
            id: 'name',
            label: 'Name',
            getBodyCellContent: ({ subscription: { id, name } }) => (
                <Link
                    to={`/subscriptions/${id}`}
                    component={RouterLink}
                    className={styles.name}
                >
                    {name}
                </Link>
            )
        },
        {
            id: 'periodType',
            label: 'Period',
            headCellProps: {
                align: 'center',
                style: {
                    width: '15%'
                }
            },
            bodyCellProps: {
                align: 'center'
            },
            getBodyCellContent: ({ subscription: { periodType } }) => {
                switch (periodType) {
                    case PERIOD_TYPE_MONTH:
                        return 'Month';
                    case PERIOD_TYPE_YEAR:
                        return 'Year';
                    default:
                        throw new Error(`Period type '${periodType}' is not supported`);
                }
            }
        },
        {
            id: 'periodStartTimestamp',
            label: 'Start date',
            getBodyCellContent: ({ usage: { periodStartTimestamp } }) => (
                format(periodStartTimestamp, shortDateTimeFormat)
            )
        },
        {
            id: 'periodEndTimestamp',
            label: 'End date',
            getBodyCellContent: ({
                endTimestamp,
                usage: { periodStartTimestamp },
                subscription: { periodType }
            }) => {
                const defaultPeriodEndTimestamp = addPeriods(
                    periodStartTimestamp,
                    periodType,
                    1
                );

                const periodEndTimestamp = endTimestamp && endTimestamp < defaultPeriodEndTimestamp
                    ? endTimestamp
                    : defaultPeriodEndTimestamp;

                return format(periodEndTimestamp, shortDateTimeFormat);
            }
        },
        {
            id: 'periodsLeft',
            label: 'Periods left',
            headCellProps: {
                align: 'right',
                style: {
                    width: '13%'
                }
            },
            bodyCellProps: {
                align: 'right'
            },
            getBodyCellContent: ({
                startTimestamp,
                endTimestamp,
                subscription,
                usage: { periodStartTimestamp }
            }) => {
                const expiresAt = endTimestamp || getSubscriptionEndTimestamp(
                    startTimestamp,
                    subscription.periodType,
                    subscription.periods
                );

                const count = getPeriodsCount(
                    periodStartTimestamp,
                    expiresAt,
                    subscription.periodType
                );

                return Math.ceil(count - 1);
            }
        },
        {
            id: 'requests',
            label: 'Requests/period',
            headCellProps: {
                align: 'right'
            },
            bodyCellProps: {
                align: 'right'
            },
            getBodyCellContent: ({ subscription: { requests } }) => requests
        },
        {
            id: 'requestsLeft',
            label: 'Balance',
            headCellProps: {
                align: 'right'
            },
            bodyCellProps: {
                align: 'right'
            },
            getBodyCellContent: ({
                subscription: { requests },
                usage: { requestsUsed }
            }) => (requests - requestsUsed)
        }
    ];

    const {
        startTimestamp,
        endTimestamp,
        subscription,
        usage
    } = props;

    const rows = [{
        id: 1,
        startTimestamp,
        endTimestamp,
        subscription,
        usage
    }];

    return (
        <Block>
            <Table
                hideSummary
                hidePagination
                cells={cells}
                rows={rows}
                total={rows.length}
                page={1}
                rowsPerPage={1}
            />
        </Block>
    );
};

UsageBlock.propTypes = {
    startTimestamp: PropTypes.instanceOf(Date).isRequired,
    endTimestamp: PropTypes.instanceOf(Date),
    subscription: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        periodType: PropTypes.oneOf([
            PERIOD_TYPE_MONTH,
            PERIOD_TYPE_YEAR
        ]).isRequired,
        periods: PropTypes.number.isRequired,
        requests: PropTypes.number.isRequired,
        startTimestamp: PropTypes.instanceOf(Date).isRequired,
        endTimestamp: PropTypes.instanceOf(Date)
    }).isRequired,
    usage: PropTypes.shape({
        userId: PropTypes.number.isRequired,
        requestsUsed: PropTypes.number.isRequired,
        periodStartTimestamp: PropTypes.instanceOf(Date).isRequired
    }).isRequired
};

UsageBlock.defaultProps = {
    endTimestamp: null
};

export default UsageBlock;
