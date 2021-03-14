const path = require('path');
const express = require('express');
const httpStatus = require('http-status-codes');
const morgan = require('morgan');
const config = require('../config/config');
const logger = require('../config/logger');
const APIError = require('./errors/api_error');

const app = express();

if (config.logging.modules.http) {
    const stream = logger.adapters.stream('http');
    app.use(morgan('common', { stream }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.env === 'development') {
    app.use('/docs', express.static(
        path.join(__dirname, '../docs/dist')
    ));
}

// app.use('/api', routes);

app.use((req, res) => {
    logger.warn(`Handler of ${req.method} '${req.url}' not found`);

    res.status(httpStatus.NOT_FOUND)
        .send({ message: 'API not found' });
});

app.use((err, req, res, next) => {
    // log error message and
    // stack trace
    logger.error(err);

    let status;
    let message;

    if (err instanceof APIError) {
        status = err.status;
        message = err.isPublic ? err.message : httpStatus.getStatusText(status);
    } else {
        status = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus.getStatusText(status);
    }

    res.status(status).send({ message });
});

app.listen(config.port, () => {
    logger.info(`Server started on port ${config.port} (${config.env})`);
});
