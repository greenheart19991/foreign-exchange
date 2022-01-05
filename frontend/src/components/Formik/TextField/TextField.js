import React from 'react';
import { Field, getIn } from 'formik';
import TextField from '../../TextField';

const FormikTextField = (props) => {
    const {
        field: { onBlur: fieldOnBlur, ...field },
        form: { touched, errors },
        meta,
        onBlur,
        helperText,
        ...rest
    } = props;

    const fieldError = getIn(errors, field.name);
    const showError = getIn(touched, field.name) && Boolean(fieldError);

    const adjustedFieldOnBlur = (e) => fieldOnBlur(e || field.name);

    return (
        <TextField
            error={showError}
            helperText={showError ? fieldError : helperText}
            onBlur={onBlur || adjustedFieldOnBlur}
            {...field}
            {...rest}
        />
    );
};

FormikTextField.propTypes = {
    ...Field.propTypes,
    ...TextField.propTypes
};

export default FormikTextField;
