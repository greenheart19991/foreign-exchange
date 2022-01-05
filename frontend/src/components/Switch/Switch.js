import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { FormControlLabel, Switch as MuiSwitch } from '@material-ui/core';
import styles from './Switch.module.scss';

const Switch = ({
    readOnly,
    disabled,
    checked,
    onChange,
    classes: {
        root: classesRoot,
        ...restClasses
    },
    SwitchProps: {
        onChange: SwitchPropsOnChange,
        disabled: SwitchPropsDisabled,
        disableRipple,
        disableFocusRipple,
        classes: {
            switchBase: SwitchPropsClassesSwitchBase,
            ...restSwitchPropsClasses
        } = {},
        ...restSwitchProps
    },
    ...restProps
}) => {
    const isDisabled = disabled || SwitchPropsDisabled;

    return (
        <FormControlLabel
            disabled={isDisabled}
            checked={Boolean(checked)}
            onChange={readOnly ? null : onChange}
            classes={{
                root: clsx(
                    { [styles.labelRo]: readOnly && !isDisabled },
                    classesRoot
                ),
                ...restClasses
            }}
            control={(
                <MuiSwitch
                    disableRipple={readOnly || disableRipple}
                    disableFocusRipple={readOnly || disableFocusRipple}
                    onChange={readOnly ? null : SwitchPropsOnChange}
                    classes={{
                        switchBase: clsx(
                            { [styles.switchBaseRo]: readOnly && !isDisabled },
                            SwitchPropsClassesSwitchBase
                        ),
                        ...restSwitchPropsClasses
                    }}
                    {...restSwitchProps}
                />
            )}
            {...restProps}
        />
    );
};

Switch.propTypes = {
    ...FormControlLabel.propTypes,
    readOnly: PropTypes.bool,
    SwitchProps: PropTypes.shape(MuiSwitch.propTypes)
};

/* eslint-disable react/default-props-match-prop-types */

Switch.defaultProps = {
    readOnly: false,
    disabled: false,
    checked: false,
    onChange: null,
    classes: {},
    SwitchProps: {}
};

/* eslint-enable react/default-props-match-prop-types */

export default Switch;
