import React from 'react';
import PropTypes from 'prop-types';
import { DateTimePicker as MuiDateTimePicker } from '@material-ui/pickers';
import TextField from '../TextField';
import { shortDateTimeFormat } from '../../i18n/dateFns';

const DateTimePicker = ({
    readOnly,
    TextFieldProps: {
        readOnly: TextFieldPropsReadOnly,
        ...restTextFieldProps
    },
    ...rest
}) => {
    const isReadOnly = readOnly || TextFieldPropsReadOnly;

    return (
        <MuiDateTimePicker
            hideTabs
            ampm={false}
            format={shortDateTimeFormat}
            readOnly={isReadOnly}
            TextFieldComponent={
                (props) => (
                    <TextField
                        {...props}
                        readOnly={isReadOnly}
                        {...restTextFieldProps}
                    />
                )
            }
            {...rest}
        />
    );
};

DateTimePicker.propTypes = {
    ...MuiDateTimePicker.propTypes,
    TextFieldProps: PropTypes.shape(TextField.propTypes)
};

/* eslint-disable react/default-props-match-prop-types */

DateTimePicker.defaultProps = {
    readOnly: false,
    TextFieldProps: {}
};

/* eslint-enable react/default-props-match-prop-types */

export default DateTimePicker;
