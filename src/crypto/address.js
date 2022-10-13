const { bech32 }  = require('bech32');

/**
 * Class creates valid address for opencbdc-tx atomizer architecture 
 */
class Address {
    
    /**
     * 
     * @param {string} script_type script type byte of address in hex
     * @param {string} pubHex hexadecimal version of public key
     */
    constructor(script_type, pubHex) {
        this.script_type = script_type;
        this.pubHex = pubHex; 
        const wordConcatBuf = [Buffer.from(this.script_type, 'hex'), Buffer.from(this.pubHex,'hex')];
        this.words = bech32.toWords(Buffer.concat(wordConcatBuf), 'utf-8');
        this.address = bech32.encode('usd', this.words);
    }

    /**
     * 
     * @returns bech32 encoded string for address for Address objects publicKey for Address.prefix
     */
    getAddress() {
        return this.address;
    }

    /**
     * @returns {Object} with fields script_type {Number} and pubHex {String} (hexdecimal string of public key)
     */
    decodeAddress() {
        const decoded = bech32.decode(this.address); // 
        const buffer = Buffer.from(bech32.fromWords(decoded.words), 'hex'); // TODO check and see if it works with just this.words
        const script_type_byte = buffer.slice(0,1).toString('hex');
        const pubkeyHexString = buffer.slice(1,buffer.length).toString('hex'); // Cut off 0 byte
        return { script_type: script_type_byte, pubkeyHex: pubkeyHexString };
    }
    
    /**
     * @returns {Object} with fields script_type {Number} and pubHex {String} (hexdecimal string of public key)
     */
    static decodeFromAddressString(address) {
        if(address === undefined || address === '') {
            return undefined;
        }
        const decoded = bech32.decode(address); // 
        const buffer = Buffer.from(bech32.fromWords(decoded.words), 'hex'); // TODO check and see if it works with just this.words
        const script_type_byte = buffer.slice(0,1).toString('hex');
        const pubkeyHexString = buffer.slice(1,buffer.length).toString('hex'); // Cut off 0 byte
        return { script_type: script_type_byte, pubkeyHex: pubkeyHexString };
    }   
    
}

module.exports = Address;
