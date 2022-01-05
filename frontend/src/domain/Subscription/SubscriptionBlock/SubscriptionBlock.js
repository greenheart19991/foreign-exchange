import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import composeRefs from '@seznam/compose-react-refs';
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { Grid, MenuItem, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { TextField, Select, DateTimePicker } from '../../../components/Formik';
import Block from '../../../components/Block';
import { PERIOD_TYPE_MONTH, PERIOD_TYPE_YEAR } from '../../../consts/periodTypes';
import styles from './SubscriptionBlock.module.scss';

const periodTypes = [
    { id: PERIOD_TYPE_MONTH, label: 'Month' },
    { id: PERIOD_TYPE_YEAR, label: 'Year' }
];

const validationSchema = yup.object({
    name: yup
        .string()
        .required('Name is required'),
    periodType: yup
        .string()
        .oneOf(periodTypes.map((r) => r.id))
        .required('Period is required'),
    periods: yup
        .number()
        .typeError('Value must be a number')
        .integer('Value must be integer')
        .min(1, 'Value cannot be lower than 1')
        .required('Periods number is required'),
    requests: yup
        .number()
        .typeError('Value must be a number')
        .integer('Value must be integer')
        .min(1, 'Value cannot be lower than 0')
        .required('Requests number is required'),
    price: yup
        .number()
        .typeError('Value must be a number')
        .min(0, 'Value cannot be lower than 0')
        .required('Price is required'),
    startTimestamp: yup
        .date()
        .nullable()
        .test({
            name: 'isNotPast',
            message: 'Value cannot be date in the past',
            test: (v) => v === null || v >= new Date()
        }),
    endTimestamp: yup
        .date()
        .nullable()
        .test({
            name: 'isFuture',
            message: 'Value must be future date',
            test: (v) => v === null || v > new Date()
        })
        .test({
            name: 'isBiggerThanStartTimestamp',
            message: 'Value must be bigger than start timestamp',
            test: (v, ctx) => {
                const { parent: { startTimestamp } } = ctx;

                return v === null
                    || startTimestamp === null
                    || v > startTimestamp;
            }
        })
});

const SubscriptionBlock = ({
    subscription,
    error,
    withControls,
    readOnly,
    onCreate,
    formikRef: propsFormikRef
}) => {
    const formikRef = useRef(null);

    const handleSubmit = async (values) => {
        if (onCreate) {
            await onCreate(values);
        }
    };

    const initialValues = subscription
        ? {
            name: subscription.name,
            periodType: subscription.periodType,
            periods: subscription.periods,
            requests: subscription.requests,
            price: subscription.price,
            startTimestamp: subscription.startTimestamp,
            endTimestamp: subscription.endTimestamp
        }
        : {
            name: '',
            periodType: PERIOD_TYPE_MONTH,
            periods: 1,
            requests: 1,
            price: 0,
            startTimestamp: null,
            endTimestamp: null
        };

    return (
        <Block>
            {
                error && (
                    <Alert
                        severity='error'
                        className={styles.alert}
                    >
                        An error occurred while creating.<br />
                        Request ended with message &lsquo;{error.message}&rsquo;
                        {
                            error.status && ` and status '${error.status}'`
                        }.
                    </Alert>
                )
            }
            <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                innerRef={composeRefs(formikRef, propsFormikRef)}
            >
                {({ isSubmitting, isValid }) => (
                    <Form>
                        <Grid
                            container
                            className={styles.gridContainer}
                        >
                            <Grid
                                item
                                xs={3}
                                className={styles.gridItem}
                            >
                                <Field
                                    component={TextField}
                                    name='name'
                                    label='Name'
                                    readOnly={readOnly}
                                    disabled={isSubmitting}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={3}
                                className={styles.gridItem}
                            >
                                <Field
                                    component={Select}
                                    name='periodType'
                                    label='Period'
                                    readOnly={readOnly}
                                    disabled={isSubmitting}
                                >
                                    {
                                        periodTypes.map(({ id, label }) => (
                                            <MenuItem
                                                key={id}
                                                value={id}
                                            >
                                                {label}
                                            </MenuItem>
                                        ))
                                    }
                                </Field>
                            </Grid>
                            <Grid
                                item
                                xs={2}
                                className={styles.gridItem}
                            >
                                <Field
                                    component={TextField}
                                    name='periods'
                                    label='Periods'
                                    readOnly={readOnly}
                                    disabled={isSubmitting}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={2}
                                className={styles.gridItem}
                            >
                                <Field
                                    component={TextField}
                                    name='requests'
                                    label='Requests/period'
                                    readOnly={readOnly}
                                    disabled={isSubmitting}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={2}
                                className={styles.gridItem}
                            >
                                <Field
                                    component={TextField}
                                    name='price'
                                    label='Price'
                                    readOnly={readOnly}
                                    disabled={isSubmitting}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={3}
                                className={styles.gridItem}
                            >
                                <Field
                                    component={DateTimePicker}
                                    name='startTimestamp'
                                    label='Start date'
                                    readOnly={readOnly}
                                    disabled={isSubmitting}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={3}
                                className={styles.gridItem}
                            >
                                <Field
                                    component={DateTimePicker}
                                    name='endTimestamp'
                                    label='End date'
                                    readOnly={readOnly}
                                    disabled={isSubmitting}
                                />
                            </Grid>
                        </Grid>
                        {
                            withControls && (
                                <div className={styles.actionsContainer}>
                                    <Button
                                        type='submit'
                                        variant='contained'
                                        color='primary'
                                        disabled={readOnly || !isValid || isSubmitting}
                                    >
                                        Create
                                    </Button>
                                </div>
                            )
                        }
                    </Form>
                )}
            </Formik>
        </Block>
    );
};

SubscriptionBlock.propTypes = {
    subscription: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        periodType: PropTypes.oneOf([
            PERIOD_TYPE_MONTH,
            PERIOD_TYPE_YEAR
        ]).isRequired,
        periods: PropTypes.number.isRequired,
        requests: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
        startTimestamp: PropTypes.instanceOf(Date).isRequired,
        endTimestamp: PropTypes.instanceOf(Date)
    }),
    error: PropTypes.exact({
        status: PropTypes.number,
        message: PropTypes.string
    }),
    readOnly: PropTypes.bool,
    withControls: PropTypes.bool,
    onCreate: PropTypes.func,
    formikRef: PropTypes.oneOfType([
        PropTypes.func,
        // eslint-disable-next-line react/forbid-prop-types
        PropTypes.shape({ current: PropTypes.object })
    ])
};

SubscriptionBlock.defaultProps = {
    subscription: null,
    error: null,
    readOnly: false,
    withControls: false,
    onCreate: null,
    formikRef: null
};

export default SubscriptionBlock;
