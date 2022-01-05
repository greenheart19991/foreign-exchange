import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import composeRefs from '@seznam/compose-react-refs';
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { Grid, MenuItem, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { TextField, Select } from '../../../components/Formik';
import Block from '../../../components/Block';
import { ROLE_USER, ROLE_ADMIN } from '../../../consts/roles';
import styles from './UserBlock.module.scss';

const roles = [
    { id: ROLE_USER, label: 'User' },
    { id: ROLE_ADMIN, label: 'Admin' }
];

const editSchema = {
    firstName: yup
        .string()
        .required('First name is required'),
    lastName: yup
        .string()
        .required('Last name is required'),
    email: yup
        .string()
        .email('Value must be a valid email')
        .required('Email is required'),
    role: yup
        .string()
        .oneOf(roles.map((r) => r.id))
        .required('Role is required'),
    password: yup
        .string()
        .min(6, 'Password should be of minimum 6 characters length')
        .max(31, 'Password should not exceed 31 characters length'),
    confirmPassword: yup
        .string()
        .when('password', {
            is: (password) => Boolean(password),
            then: (schema) => schema.required('You are required to confirm password')
        })
        .oneOf([yup.ref('password')], 'Passwords must match')
};

const createSchema = {
    ...editSchema,
    password: editSchema
        .password
        .required('Password is required')
};

const UserBlock = ({
    user,
    error,
    withControls,
    withEditMode,
    readOnly,
    canSetRole,
    onSubmit,
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
        if (onSubmit) {
            await onSubmit(values);
        }

        if (withEditMode) {
            setIsEditMode(false);
        }
    };

    const schema = user ? editSchema : createSchema;
    const validationSchema = yup.object(schema);

    const initialValues = {
        ...(
            user
                ? {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }
                : {
                    firstName: '',
                    lastName: '',
                    email: '',
                    role: ROLE_USER
                }
        ),
        password: '',
        confirmPassword: ''
    };

    const fieldBaseReadOnly = readOnly || (withControls && withEditMode && !isEditMode);

    return (
        <Block>
            {
                error && (
                    <Alert
                        severity='error'
                        className={styles.alert}
                    >
                        An error occurred while {user ? 'updating' : 'creating'}.<br />
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
                                    name='firstName'
                                    label='First name'
                                    readOnly={fieldBaseReadOnly}
                                    disabled={isSubmitting}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={3}
                                className={styles.gridItem}
                            >
                                <Field
                                    component={TextField}
                                    name='lastName'
                                    label='Last name'
                                    readOnly={fieldBaseReadOnly}
                                    disabled={isSubmitting}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={3}
                                className={styles.gridItem}
                            >
                                <Field
                                    component={TextField}
                                    name='email'
                                    label='Email'
                                    readOnly={fieldBaseReadOnly}
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
                                    name='role'
                                    label='Role'
                                    readOnly={fieldBaseReadOnly || !canSetRole}
                                    disabled={isSubmitting}
                                >
                                    {
                                        roles.map(({ id, label }) => (
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
                                xs={3}
                                className={styles.gridItem}
                            >
                                <Field
                                    component={TextField}
                                    name='password'
                                    type='password'
                                    label='Password'
                                    readOnly={fieldBaseReadOnly}
                                    disabled={isSubmitting}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={3}
                                className={styles.gridItem}
                            >
                                <Field
                                    component={TextField}
                                    name='confirmPassword'
                                    type='password'
                                    label='Confirm password'
                                    readOnly={fieldBaseReadOnly}
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
                                                disabled={readOnly || !isValid || isSubmitting}
                                            >
                                                {user ? 'Save' : 'Create'}
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
                                                disabled={readOnly}
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
                                                {user ? 'Save' : 'Create'}
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

UserBlock.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.oneOf([
            ROLE_USER,
            ROLE_ADMIN
        ]).isRequired
    }),
    error: PropTypes.exact({
        status: PropTypes.number,
        message: PropTypes.string
    }),
    withControls: PropTypes.bool,
    withEditMode: PropTypes.bool,
    readOnly: PropTypes.bool,
    canSetRole: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancelEdit: PropTypes.func,
    formikRef: PropTypes.oneOfType([
        PropTypes.func,
        // eslint-disable-next-line react/forbid-prop-types
        PropTypes.shape({ current: PropTypes.object })
    ])
};

UserBlock.defaultProps = {
    user: null,
    error: null,
    withControls: false,
    withEditMode: false,
    readOnly: false,
    canSetRole: false,
    onSubmit: null,
    onCancelEdit: null,
    formikRef: null
};

export default UserBlock;
