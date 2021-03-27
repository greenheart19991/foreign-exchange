const bcrypt = require('bcrypt');
const config = require('../../config/config');

class BCryptHashService {
    constructor({ saltRounds }) {
        this._saltRounds = saltRounds;
    }

    async hash(str) {
        return bcrypt.hash(str, this._saltRounds);
    }

    async compare(str, hash) {
        return bcrypt.compare(str, hash);
    }
}

module.exports = new BCryptHashService({
    saltRounds: config.bcrypt.saltRounds
});
