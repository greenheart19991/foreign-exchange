const BaseError = require('./base_error');

class OperationError extends BaseError {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}

module.exports = OperationError;
