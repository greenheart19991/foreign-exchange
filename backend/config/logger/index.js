const pino = require('pino');
const config = require('../config');
const adapterStreamFnFactory = require('./adapters/stream');

// Pino-pretty that is used in dev env to prettify pino
// logs currently does not support configuring labels for
// pino custom levels. Thus, pino-pretty sets default
// 'USRLVL' label for them as for any undefined level.
// See more: https://github.com/pinojs/pino-pretty/issues/62#issuecomment-526982856

const logger = pino({
    customLevels: {
        http: 31
    },
    level: config.logging.level,
    formatters: {
        level: (label, number) => ({ level: label })
    }
});

const adapterStreamFn = adapterStreamFnFactory(logger);

module.exports = logger;
module.exports.adapters = {
    stream: adapterStreamFn
};
