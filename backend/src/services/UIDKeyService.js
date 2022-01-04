const uid = require('uid-safe');
const { KEY_BYTE_LEN } = require('../constants/key');

class UIDKeyService {
    constructor({ length }) {
        this._length = length;
    }

    async generate() {
        const str = await uid(this._length);
        return str.substring(0, KEY_BYTE_LEN);
    }
}

module.exports = new UIDKeyService({
    length: KEY_BYTE_LEN
});
