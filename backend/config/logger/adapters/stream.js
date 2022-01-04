const { Writable } = require('stream');

class PinoAdapterStream extends Writable {
    constructor(pinoInstance, logMethod, options) {
        super({
            ...options,
            decodeStrings: false
        });

        this._logger = pinoInstance;
        this._method = logMethod;
    }

    _write(chunk, encoding, callback) {
        this._logger[this._method](chunk);
        callback();
    }
}

// eslint-disable-next-line arrow-body-style
module.exports = (pinoInstance) => (logMethod, options) => {
    return new PinoAdapterStream(pinoInstance, logMethod, options);
};
