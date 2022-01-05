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
import styles from './LoginPage.module.scss';

const validationSchema = yup.object({
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

const LoginPage = () => {
    const { loadCurrentUser } = useAuthContext();
    const history = useHistory();

    const onSubmit = async (values, actions) => {
        actions.setStatus(null);

        try {
            await api.auth.login(values);
        } catch (e) {
            const { status, message } = getAPIResponseErrorSummary(e);

            actions.setStatus({
                status,
                message
            });

            return;
        }

        const {
            state: {
                referrer: { pathname }
            } = {
                referrer: { pathname: '/' }
            }
        } = history.location;

        loadCurrentUser();
        history.push(pathname);
    };

    return (
        <div className={styles.page}>
            <Paper className={styles.container}>
                <Typography
                    variant='h5'
                    className={styles.title}
                >
                    Log In
                </Typography>
                <Typography
                    color='textSecondary'
                    className={styles.hint}
                >
                    admin - edyth.crooks@gmail.com
                </Typography>
                <Typography
                    color='textSecondary'
                    className={styles.hint}
                >
                    user - hyman.beatty@gmail.com
                </Typography>
                <Formik
                    initialValues={{
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
                                            error.status === 401
                                                ? error.message
                                                : 'An error occurred while logging in.\n'
                                                    + `Request ended with message '${error.message}'`
                                                    + `${error.status ? ` and status '${error.status}'` : ''}.`
                                        }
                                    </Alert>
                                )
                            }
                            <div className={styles.actionsContainer}>
                                <Link
                                    to='/signup'
                                    component={RouterLink}
                                >
                                    Don&apos;t have an account?
                                </Link>
                                <Button
                                    type='submit'
                                    variant='contained'
                                    color='primary'
                                    disabled={isSubmitting || !isValid}
                                >
                                    Login
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </div>
    );
};

export default LoginPage;
