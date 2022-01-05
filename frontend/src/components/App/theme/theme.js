import { createMuiTheme } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

// if you'll need to customize theme
// (e.g. colors, shadows etc) put all the variables
// in .scss partials in 'assets' dir and import them here:
// to prevent defining them here and there
// at the same time.

const theme = createMuiTheme({
    palette: {
        primary: deepPurple
    },
    props: {
        MuiPaper: {
            square: false
        },
        MuiCard: {
            variant: 'outlined'
        },
        MuiFormControl: {
            variant: 'outlined'
        },
        MuiTextField: {
            variant: 'outlined'
        },
        MuiTab: {
            variant: 'contained'
        }
    },
    overrides: {
        MuiPaper: {
            rounded: {
                borderRadius: 15
            }
        },
        MuiCard: {
            root: {
                borderRadius: 15
            }
        },
        MuiButton: {
            root: {
                borderRadius: 8
            }
        },
        MuiInputBase: {
            root: {
                borderRadius: 8
            }
        },
        MuiOutlinedInput: {
            root: {
                borderRadius: 8
            }
        },
        MuiTab: {
            root: {
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8
            }
        },
        MuiAlert: {
            root: {
                borderRadius: 10
            }
        }
    }
});

export default theme;
