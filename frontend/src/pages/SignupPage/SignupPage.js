import React from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { Paper, Typography, Link, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { TextField } from '../../components/Formik';
import { useAuthContext } from '../../context/AuthContext';
import { getAPIResponseErrorSummary } from '../../helpers/api';
import api from '../../services/api';
import styles from './SignupPage.module.scss';

const validationSchema = yup.object({
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
    password: yup
        .string()
        .min(6, 'Password should be of minimum 6 characters length')
        .max(31, 'Password should not exceed 31 characters length')
        .required('Password is required')
});

const SignupPage = () => {
    const { loadCurrentUser } = useAuthContext();
    const history = useHistory();

    const onSubmit = async (values, actions) => {
        actions.setStatus(null);

        try {
            await api.auth.signup(values);
        } catch (e) {
            const { status, message } = getAPIResponseErrorSummary(e);

            actions.setStatus({
                status,
                message
            });

            return;
        }

        loadCurrentUser();
        history.push('/');
    };

    return (
        <div className={styles.page}>
            <Paper className={styles.container}>
                <Typography
                    variant='h5'
                    className={styles.title}
                >
                    Sign Up
                </Typography>
                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting, isValid, status: error }) => (
                        <Form>
                            <Field
                                component={TextField}
                                name='firstName'
                                label='First name'
                                className={styles.field}
                                disabled={isSubmitting}
                            />
                            <Field
                                component={TextField}
                                name='lastName'
                                label='Last name'
                                className={styles.field}
                                disabled={isSubmitting}
                            />
                            <Field
                                component={TextField}
                                name='email'
                                label='Email'
                                className={styles.field}
                                disabled={isSubmitting}
                            />
                            <Field
                                component={TextField}
                                name='password'
                                type='password'
                                label='Password'
                                className={styles.field}
                                disabled={isSubmitting}
                            />
                            {
                                error && (
                                    <Alert severity='error'>
                                        {
                                            error.status === 409
                                                ? error.message
                                                : 'An error occurred while registering.\n'
                                                    + `Request ended with message '${error.message}'`
                                                    + `${error.status ? ` and status '${error.status}'` : ''}.`
                                        }
                                    </Alert>
                                )
                            }
                            <div className={styles.actionsContainer}>
                                <Link
                                    to='/login'
                                    component={RouterLink}
                                >
                                    Already have an account?
                                </Link>
                                <Button
                                    type='submit'
                                    variant='contained'
                                    color='primary'
                                    disabled={isSubmitting || !isValid}
                                >
                                    Signup
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </div>
    );
};

export default SignupPage;
