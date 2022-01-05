import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import composeRefs from '@seznam/compose-react-refs';
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { Grid, MenuItem, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Select, DateTimePicker } from '../../../components/Formik';
import Block from '../../../components/Block';
import { PERIOD_TYPE_MONTH, PERIOD_TYPE_YEAR } from '../../../consts/periodTypes';
import { getSubscriptionEndTimestamp } from '../../../helpers/period';
import { stableSort, ascendingComparator } from '../../../helpers/sort';
import styles from './GrantBlock.module.scss';

const nameAscComparator = (a, b) => ascendingComparator(a.name, b.name);
const priceAscComparator = (a, b) => ascendingComparator(a.price, b.price);

const getSchema = (subscriptions, isRequired) => {
    let idSchema = yup
        .number()
        .integer()
        .oneOf(subscriptions.map((s) => s.id));

    if (isRequired) {
        idSchema = idSchema.required('Subscription is required');
    }

    const schema = {
        subscriptionId: idSchema,
        endTimestamp: yup
            .date()
            .nullable()
            .test({
                name: 'isNotPast',
                message: 'Value cannot be date in the past',
                test: (v) => v === null || v >= new Date()
            })
            .test({
                name: 'isLowerThanExpTimestamp',
                message: 'Value cannot be after time subscription expires (${strExpiresAt})',
                test: (v, ctx) => {
                    const { parent: { subscriptionId } } = ctx;
                    if (subscriptionId === undefined) {
                        return true;
                    }

                    const subscription = subscriptions.find((s) => s.id === subscriptionId);
                    const now = new Date();

                    const expiresAt = getSubscriptionEndTimestamp(
                        now,
                        subscription.periodType,
                        subscription.periods
                    );

                    if (v < expiresAt) {
                        return true;
                    }

                    const strExpiresAt = expiresAt.toISOString();

                    return ctx.createError({
                        params: { strExpiresAt }
                    });
                }
            })
    };

    return yup.object(schema);
};

const GrantBlock = ({
    subscriptionId,
    endTimestamp,
    subscriptions,
    error,
    allowedEmpty,
    withControls,
    withEditMode,
    onGrant,
    onCancelEdit,
    formikRef: propsFormikRef
}) => {
    const formikRef = useRef(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const handleCancelEdit = () => {
        if (onCancelEdit) {
            onCancelEdit();
        }

        formikRef.current.resetForm();
        setIsEditMode(false);
    };

    const handleSubmit = async (values) => {
        if (onGrant) {
            await onGrant(values);
        }

        if (withEditMode) {
            setIsEditMode(false);
        }
    };

    const validationSchema = getSchema(subscriptions, !allowedEmpty);

    const initialValues = {
        subscriptionId: subscriptionId !== null ? subscriptionId : '',
        endTimestamp
    };

    const fieldReadOnly = withControls && withEditMode && !isEditMode;
    const now = new Date();

    let sSubscriptions = stableSort(subscriptions, nameAscComparator);
    sSubscriptions = stableSort(sSubscriptions, priceAscComparator);

    return (
        <Block>
            {
                error && (
                    <Alert
                        severity='error'
                        className={styles.alert}
                    >
                        An error occurred while performing grant operation.<br />
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
                                    component={Select}
                                    name='subscriptionId'
                                    label='Subscription'
                                    readOnly={fieldReadOnly}
                                    disabled={isSubmitting}
                                >
                                    {
                                        sSubscriptions.map((s) => {
                                            const isArchived = s.endTimestamp !== null && s.endTimestamp <= now;
                                            const isUnpublished = s.startTimestamp > now;

                                            return (
                                                <MenuItem
                                                    key={s.id}
                                                    value={s.id}
                                                    disabled={isArchived || isUnpublished}
                                                >
                                                    {s.name}
                                                </MenuItem>
                                            );
                                        })
                                    }
                                </Field>
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
                                    readOnly={fieldReadOnly}
                                    disabled={isSubmitting}
                                />
                            </Grid>
                        </Grid>
                        {
                            withControls && (
                                <div className={styles.actionsContainer}>
                                    {
                                        !withEditMode && (
                                            <Button
                                                type='submit'
                                                variant='contained'
                                                color='primary'
                                                className={styles.actionButton}
                                                disabled={!isValid || isSubmitting}
                                            >
                                                Grant
                                            </Button>
                                        )
                                    }
                                    {
                                        withEditMode && !isEditMode && (
                                            <Button
                                                type='button'
                                                variant='contained'
                                                color='primary'
                                                className={styles.actionButton}
                                                onClick={() => setIsEditMode(true)}
                                            >
                                                Edit
                                            </Button>
                                        )
                                    }
                                    {
                                        withEditMode && isEditMode && ([
                                            <Button
                                                key={1}
                                                type='button'
                                                color='primary'
                                                className={styles.actionButton}
                                                disabled={isSubmitting}
                                                onClick={handleCancelEdit}
                                            >
                                                Cancel
                                            </Button>,
                                            <Button
                                                key={2}
                                                type='submit'
                                                variant='contained'
                                                color='primary'
                                                className={styles.actionButton}
                                                disabled={!isValid || isSubmitting}
                                            >
                                                Grant
                                            </Button>
                                        ])
                                    }
                                </div>
                            )
                        }
                    </Form>
                )}
            </Formik>
        </Block>
    );
};

GrantBlock.propTypes = {
    subscriptionId: PropTypes.number,
    endTimestamp: PropTypes.instanceOf(Date),
    subscriptions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        periodType: PropTypes.oneOf([
            PERIOD_TYPE_MONTH,
            PERIOD_TYPE_YEAR
        ]).isRequired,
        periods: PropTypes.number.isRequired,
        startTimestamp: PropTypes.instanceOf(Date).isRequired,
        endTimestamp: PropTypes.instanceOf(Date)
    })).isRequired,
    error: PropTypes.exact({
        status: PropTypes.number,
        message: PropTypes.string
    }),
    allowedEmpty: PropTypes.bool,
    withControls: PropTypes.bool,
    withEditMode: PropTypes.bool,
    onGrant: PropTypes.func,
    onCancelEdit: PropTypes.func,
    formikRef: PropTypes.oneOfType([
        PropTypes.func,
        // eslint-disable-next-line react/forbid-prop-types
        PropTypes.shape({ current: PropTypes.object })
    ])
};

GrantBlock.defaultProps = {
    subscriptionId: null,
    endTimestamp: null,
    error: null,
    allowedEmpty: false,
    withControls: false,
    withEditMode: false,
    onGrant: null,
    onCancelEdit: null,
    formikRef: null
};

export default GrantBlock;
