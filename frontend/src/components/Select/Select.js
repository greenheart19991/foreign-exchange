import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
    FormControl,
    InputLabel,
    Select as MuiSelect,
    FormHelperText
} from '@material-ui/core';
import styles from './Select.module.scss';

const Select = ({
    label,
    helperText,
    readOnly,
    disabled,
    children,
    FormHelperTextProps,
    InputLabelProps: {
        disabled: InputLabelPropsDisabled,
        classes: {
            root: InputLabelClassesRoot,
            ...restInputLabelClasses
        } = {},
        ...restInputLabelProps
    },
    SelectProps: {
        disabled: SelectPropsDisabled,
        MenuProps: {
            classes: {
                paper: SelectPropsMenuPropsClassesPaper,
                ...restSelectPropsMenuPropsClasses
            } = {},
            ...restSelectPropsMenuProps
        } = {},
        classes: {
            select: SelectPropsClassesSelect,
            ...restSelectPropsClasses
        } = {},
        ...restSelectProps
    },
    ...restFormControlProps
}) => (
    <FormControl
        fullWidth
        disabled={readOnly || disabled}
        {...restFormControlProps}
    >
        <InputLabel
            disabled={InputLabelPropsDisabled}
            classes={{
                root: clsx(
                    styles.label,
                    { [styles.labelRo]: readOnly && !(disabled || InputLabelPropsDisabled) },
                    InputLabelClassesRoot
                ),
                ...restInputLabelClasses
            }}
            {...restInputLabelProps}
        >
            {label}
        </InputLabel>
        <MuiSelect
            label={label}
            disabled={SelectPropsDisabled}
            MenuProps={{
                classes: {
                    paper: clsx(styles.menuPaper, SelectPropsMenuPropsClassesPaper),
                    ...restSelectPropsMenuPropsClasses
                },
                ...restSelectPropsMenuProps
            }}
            classes={{
                select: clsx(
                    styles.select,
                    { [styles.selectRo]: readOnly && !(disabled || SelectPropsDisabled) },
                    SelectPropsClassesSelect
                ),
                ...restSelectPropsClasses
            }}
            {...restSelectProps}
        >
            {children}
        </MuiSelect>
        {
            helperText && (
                <FormHelperText
                    disabled={disabled}
                    {...FormHelperTextProps}
                >
                    {helperText}
                </FormHelperText>
            )
        }
    </FormControl>
);

Select.propTypes = {
    ...FormControl.propTypes,
    label: PropTypes.node,
    helperText: PropTypes.node,
    readOnly: PropTypes.bool,
    InputLabelProps: PropTypes.shape(InputLabel.propTypes),
    SelectProps: PropTypes.shape(MuiSelect.propTypes),
    FormHelperTextProps: PropTypes.shape(FormHelperText.propTypes),
    children: PropTypes.node.isRequired
};

/* eslint-disable react/default-props-match-prop-types */

Select.defaultProps = {
    label: null,
    helperText: null,
    readOnly: false,
    disabled: false,
    InputLabelProps: {},
    SelectProps: {},
    FormHelperTextProps: {}
};

/* eslint-enable react/default-props-match-prop-types */

export default Select;
