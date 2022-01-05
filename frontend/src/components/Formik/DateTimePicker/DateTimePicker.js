import React from 'react';
import { Field, getIn } from 'formik';
import DateTimePicker from '../../DateTimePicker';

const FormikDateTimePicker = (props) => {
    const {
        field: { onChange: _onChange, onBlur: fieldOnBlur, ...field },
        form: { touched, errors, setFieldValue, setFieldError },
        meta,
        onChange,
        onBlur,
        onError,
        helperText,
        ...rest
    } = props;

    const fieldError = getIn(errors, field.name);
    const showError = getIn(touched, field.name) && Boolean(fieldError);

    const adjustedFieldOnChange = (date) => setFieldValue(field.name, date);
    const adjustedFieldOnBlur = (e) => fieldOnBlur(e || field.name);
    const adjustedFieldOnError = (error) => {
        if (error !== fieldError && error !== '') {
            setFieldError(field.name, error ? String(error) : undefined);
        }
    };

    return (
        <DateTimePicker
            error={showError}
            helperText={showError ? fieldError : helperText}
            onChange={onChange || adjustedFieldOnChange}
            onBlur={onBlur || adjustedFieldOnBlur}
            onError={onError || adjustedFieldOnError}
            {...field}
            {...rest}
        />
    );
};

FormikDateTimePicker.propTypes = {
    ...Field.propTypes,
    ...DateTimePicker.propTypes
};

export default FormikDateTimePicker;
