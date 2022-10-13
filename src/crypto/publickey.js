const Secp256k1 = require('@enumatech/secp256k1-js');
const buffer = require('buffer/').Buffer;

class PublicKey {

    /**
     * @param secretKeyData privateKey hex string
     */
    constructor(secretKeyData) {
        this.secretKeyBuf = buffer.from(secretKeyData, 'hex');
        this.publicKey = Secp256k1.generatePublicKeyFromPrivateKeyData(Secp256k1.uint256(secretKeyData, 16)).x;
    }

    /**
     * @param {string} secretKeyBuf
     * @returns {Buffer} PublicKey Buffer 
     */
    static fromPrivateKeyData(secretKeyData) {
        const pubHex = Secp256k1.generatePublicKeyFromPrivateKeyData(Secp256k1.uint256(secretKeyData, 16)).x;
        return buffer.from(pubHex, 'hex');
    }
    
    /**
     * @returns {Buffer} representing a public key in size x bytes
     */
    toBuffer() {
        return buffer.from(this.publicKey, 'hex');
    }
}

module.exports = PublicKey;

