import React from 'react';
import PropTypes from 'prop-types';
import {
    Typography, Button,
    Card, CardContent, CardActions
} from '@material-ui/core';
import { PERIOD_TYPE_MONTH, PERIOD_TYPE_YEAR } from '../../../../../consts/periodTypes';
import styles from './OfferCard.module.scss';

const castNoun = (singularNoun, count) => {
    if (count === 1) {
        return singularNoun;
    }

    const countStr = count.toString();
    const hasS = countStr[countStr.length - 1] !== '1';

    return `${singularNoun}${hasS ? 's' : ''}`;
};

const getLabel = (periodType, periodsCount) => {
    const prefix = 'For';
    let text;

    switch (periodType) {
        case PERIOD_TYPE_MONTH: {
            if (periodsCount % 12 === 0) {
                const count = periodsCount / 12;
                if (count === 1) {
                    text = 'year';
                } else {
                    text = `${count} ${castNoun('year', count)}`;
                }
            } else if (periodsCount === 1) {
                text = 'month';
            } else {
                text = `${periodsCount} ${castNoun('month', periodsCount)}`;
            }

            break;
        }
        case PERIOD_TYPE_YEAR: {
            if (periodsCount === 1) {
                text = 'year';
            } else {
                text = `${periodsCount} ${castNoun('year', periodsCount)}`;
            }

            break;
        }
        default:
            throw new Error(`Period type '${periodType}' is not supported`);
    }

    return `${prefix} ${text}`;
};

const getPeriodAbbreviation = (periodType) => {
    switch (periodType) {
        case PERIOD_TYPE_MONTH:
            return 'mo.';
        case PERIOD_TYPE_YEAR:
            return 'year';
        default:
            throw new Error(`Period type '${periodType}' is not supported`);
    }
};

const OfferCard = ({
    subscription,
    disabled,
    onCreateOrder
}) => (
    <Card className={styles.card}>
        <CardContent className={styles.cardContent}>
            <Typography
                variant='body2'
                color='textSecondary'
                className={styles.label}
            >
                {getLabel(subscription.periodType, subscription.periods)}
            </Typography>
            <Typography
                variant='h5'
                component='h2'
                className={styles.title}
            >
                {subscription.name}
            </Typography>
            <Typography
                color='textSecondary'
                className={styles.pos}
            >
                {subscription.requests} req/{getPeriodAbbreviation(subscription.periodType)}
            </Typography>
            <Typography
                variant='h6'
                className={styles.price}
            >
                {
                    subscription.price
                        ? `$${subscription.price}`
                        : 'Free'
                }
            </Typography>
        </CardContent>
        <CardActions className={styles.cardActions}>
            <Button
                type='button'
                variant='contained'
                color='primary'
                className={styles.actionButton}
                disabled={disabled}
                onClick={onCreateOrder}
            >
                Buy
            </Button>
        </CardActions>
    </Card>
);

OfferCard.propTypes = {
    subscription: PropTypes.shape({
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
    }).isRequired,
    disabled: PropTypes.bool,
    onCreateOrder: PropTypes.func
};

OfferCard.defaultProps = {
    disabled: false,
    onCreateOrder: null
};

export default OfferCard;
