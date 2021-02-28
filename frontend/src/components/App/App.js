import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/core/styles';
import { locale } from '../../i18n/pickers';
import theme from './theme';

const App = () => (
    <MuiPickersUtilsProvider
        utils={DateFnsUtils}
        locale={locale}
    >
        <ThemeProvider theme={theme}>
            {/* <Auth context provider> */}
            {/*     <Routes /> */}
            {/* </Auth context provider> */}
        </ThemeProvider>
    </MuiPickersUtilsProvider>
);

export default App;
