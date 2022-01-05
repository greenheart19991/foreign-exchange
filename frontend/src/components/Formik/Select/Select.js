import React from 'react';
import { Field, getIn } from 'formik';
import Select from '../../Select';

const FormikSelect = (props) => {
    const {
        field: { onBlur: fieldOnBlur, ...field },
        form: { touched, errors },
        meta,
        helperText,
        SelectProps: {
            onBlur,
            ...restSelectProps
        } = {},
        ...rest
    } = props;

    const fieldError = getIn(errors, field.name);
    const showError = getIn(touched, field.name) && Boolean(fieldError);

    const adjustedFieldOnBlur = (e) => fieldOnBlur(e || field.name);

    return (
        <Select
            error={showError}
            helperText={showError ? fieldError : helperText}
            SelectProps={{
                onBlur: onBlur || adjustedFieldOnBlur,
                ...field,
                ...restSelectProps
            }}
            {...rest}
        />
    );
};

FormikSelect.propTypes = {
    ...Field.propTypes,
    ...Select.propTypes
};

export default FormikSelect;
