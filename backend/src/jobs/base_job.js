class Job {
    constructor() {
        if (new.target === Job) {
            throw new TypeError('Cannot construct Job instances directly');
        }
    }

    setup() {
        throw new Error('setup() is not implemented');
    }

    destroy() {
        throw new Error('destroy() is not implemented');
    }
}

module.exports = Job;
