export { default as locale } from 'date-fns/locale/en-US';

const shortDateFormat = 'MM/dd/yyyy';
const longDateFormat = 'MMM dd yyyy';

const timeFormat = 'hh:mm a';

const shortDateTimeFormat = `${shortDateFormat} ${timeFormat}`;
const longDateTimeFormat = `${longDateFormat}, ${timeFormat}`;

export {
    shortDateFormat,
    longDateFormat,
    timeFormat,

    shortDateTimeFormat,
    longDateTimeFormat
};
