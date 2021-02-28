import { createMuiTheme } from '@material-ui/core/styles';
import deepPurple from '@material-ui/core/colors/deepPurple';

// if you'll need to customize theme
// (e.g. colors, shadows etc) put all the variables
// in .scss partials in 'assets' dir and import it here:
// to prevent declaring them here and there
// at the same time.

const theme = createMuiTheme({
    palette: {
        primary: deepPurple
    },
    props: {
        MuiButton: {
            disableElevation: true
        },
        MuiFormControl: {
            variant: 'outlined'
        },
        MuiTextField: {
            variant: 'outlined'
        },
        MuiCircularProgress: {
            thickness: 2.8
        }
    }
});

export default theme;
