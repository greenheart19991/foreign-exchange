const path = require('path');
const express = require('express');
const httpStatus = require('http-status-codes');
const morgan = require('morgan');
const config = require('../config/config');
const logger = require('../config/logger');
const APIError = require('./errors/api_error');
const router = require('./router');
const cleanSessionsJobFactory = require('./jobs/clean_sessions_job');

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

if (config.env === 'production') {
    app.set('trust proxy', config.trustProxy);
}

app.use('/api', router);

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

const cleanSessionsJob = cleanSessionsJobFactory(
    config.jobs.cleanSessions.pattern,
    config.jobs.cleanSessions.bunchSize,
    config.jobs.cleanSessions.interval
);

cleanSessionsJob.setup();

const exitHandler = (eventType, args) => {
    let exitCode;
    switch (eventType) {
        case 'exit': {
            // eslint-disable-next-line prefer-destructuring
            exitCode = args[0];
            break;
        }
        case 'SIGINT':
        case 'SIGUSR1':
        case 'SIGUSR2':
        case 'SIGTERM': {
            // eslint-disable-next-line prefer-destructuring
            exitCode = args[1];
            break;
        }
        case 'uncaughtException': {
            exitCode = 1;
            break;
        }
        default: {
            exitCode = 0;
        }
    }

    // cleanup jobs
    if (eventType === 'exit') {
        cleanSessionsJob.destroy();
    }

    process.exit(exitCode);
};

['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, (...args) => exitHandler(eventType, args));
});

app.listen(config.port, async () => {
    logger.info(`Server started on port ${config.port} (${config.env})`);
});
