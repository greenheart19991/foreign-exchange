const bcrypt = require('bcrypt');
const config = require('../../config/config');

class BCryptEncryptionService {
    constructor({ saltRounds }) {
        this._saltRounds = saltRounds;
    }

    async encrypt(str) {
        return bcrypt.hash(str, this._saltRounds);
    }

    async compare(str, hash) {
        return bcrypt.compare(str, hash);
    }
}

module.exports = new BCryptEncryptionService({
    saltRounds: config.bcrypt.saltRounds
});
