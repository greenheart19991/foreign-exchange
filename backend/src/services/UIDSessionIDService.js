const uid = require('uid-safe');
const { SID_BYTE_LEN } = require('../constants/session');

class UIDSessionIDService {
    constructor({ length }) {
        this._length = length;
    }

    async generate() {
        const str = await uid(this._length);
        return str.substring(0, SID_BYTE_LEN);
    }
}

module.exports = new UIDSessionIDService({
    length: SID_BYTE_LEN
});
