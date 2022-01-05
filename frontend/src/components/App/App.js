import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/core/styles';
import { AuthProvider } from '../../context/AuthContext';
import AppRouter from '../../routes/AppRouter';
import { locale } from '../../i18n/dateFns';
import theme from './theme';

const App = () => (
    <MuiPickersUtilsProvider
        utils={DateFnsUtils}
        locale={locale}
    >
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
        </ThemeProvider>
    </MuiPickersUtilsProvider>
);

export default App;
