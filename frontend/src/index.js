import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { StylesProvider } from '@material-ui/core/styles';
import App from './components/App';

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <StylesProvider injectFirst>
            <CssBaseline />
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </StylesProvider>,
        document.getElementById('root')
    );
});
