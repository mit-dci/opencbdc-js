const Secp256k1 = require('@enumatech/secp256k1-js');
const crypto = require('crypto');
const buffer = require('buffer/').Buffer;

class SecretKey {
    /**
     * 
     * @param {Buffer} randBytes 32 byte buffer to generate private key from
     */
    constructor(randBytes) {
        this.secretKeyBuf = randBytes || crypto.randomBytes(32);
        this.secretKey = Secp256k1.uint256(this.secretKeyBuf);
    }

    /**
     * 
     * @returns string representation of secret key Buffer representation of private key
     */
    toString() {
        return this.secretKey.toString();
    }

    /**
     * @returns {Buffer} secretKey Buffer formation
     */
    toBuffer() {    
        return this.secretKey;
    }
    
    /**
     * @param {*} secretKeyHex hex string representing 32 random bytes
     * @returns PrivateKey from privateKe
     */
    static fromHex(secretKeyHex) {
        return new SecretKey(buffer.from(secretKeyHex, 'hex'));
    }

    /**
     * 
     * @returns {string} hexadecimal version of private key
     */
    toHex() {
        return Buffer.toString(this.secretKeyBuf, 'hex');
    }
}

module.exports = SecretKey;