import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { TextField as MuiTextField } from '@material-ui/core';
import styles from './TextField.module.scss';

const TextField = ({
    readOnly,
    disabled,
    InputProps: {
        disabled: InputPropsDisabled,
        classes: {
            root: InputPropsClassesRoot,
            input: InputPropsClassesInput,
            ...restInputPropsClasses
        } = {},
        ...restInputProps
    },
    InputLabelProps: {
        disabled: InputLabelPropsDisabled,
        classes: {
            root: InputLabelClassesRoot,
            ...restInputLabelClasses
        } = {},
        ...restInputLabelProps
    },
    ...restProps
}) => (
    <MuiTextField
        fullWidth
        disabled={readOnly || disabled}
        InputProps={{
            disabled: InputPropsDisabled,
            classes: {
                root: clsx(
                    { [styles.rootRo]: readOnly && !(disabled || InputPropsDisabled) },
                    InputPropsClassesRoot
                ),
                input: clsx(styles.input, InputPropsClassesInput),
                ...restInputPropsClasses
            },
            ...restInputProps
        }}
        InputLabelProps={{
            disabled: InputLabelPropsDisabled,
            classes: {
                root: clsx(
                    styles.label,
                    { [styles.labelRo]: readOnly && !(disabled || InputLabelPropsDisabled) },
                    InputLabelClassesRoot
                ),
                ...restInputLabelClasses
            },
            ...restInputLabelProps
        }}
        {...restProps}
    />
);

TextField.propTypes = {
    ...MuiTextField.propTypes,
    readOnly: PropTypes.bool
};

/* eslint-disable react/default-props-match-prop-types */

TextField.defaultProps = {
    readOnly: false,
    disabled: false,
    InputProps: {},
    InputLabelProps: {}
};

/* eslint-enable react/default-props-match-prop-types */

export default TextField;
