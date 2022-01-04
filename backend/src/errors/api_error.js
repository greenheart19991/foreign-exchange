const httpStatus = require('http-status-codes');
const BaseError = require('./base_error');

class APIError extends BaseError {
    constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = true) {
        super(message);

        this.status = status;
        this.isPublic = isPublic;
    }
}

module.exports = APIError;
