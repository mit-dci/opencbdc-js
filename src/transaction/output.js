const crypto = require('crypto');
const buffer = require('buffer/').Buffer;

/**
 * Output class represents the 'output' abstraction in digital currency transaction
 * in which it has a witnessProgramCommitment to reference from the UHS set and value indicating how much it is worth
 */

class Output {
    
    /**
     * @param {string} witnessProgramCommitment version of the output
     * @param  {BigInt} value of the output
     * @return Output
     */
    constructor(witnessProgramCommitment, value)   {
        this.witnessProgramCommitment = witnessProgramCommitment;
        this.value = value;
    }

    /**
     * 
     * @returns {Buffer} bytes of the outputs
     */
    writeOutputToBuffer() {
        const valueBuffer = buffer.alloc(8);
        valueBuffer.writeBigUInt64LE(BigInt(this.value));
        return buffer.concat([buffer.from(this.witnessProgramCommitment, 'hex'), valueBuffer]);   
    }

    /**
     * 
     * @returns {Output} formed from public key in hex and value
     */

    static fromOutputData(pubHex, value) {
        const buf = buffer.concat([
            buffer.from('00', 'hex'),   // script type
            buffer.from(pubHex, 'hex')  // "address"
        ]);
    
        const hash = crypto.createHash('sha256');
        hash.update(buf);
        const witnessProgramCommitment = hash.digest('hex');

        return new Output(witnessProgramCommitment, value);
    }

    /**
     * @returns JSON representation of this output
     */
    toString() {
        const output = { witnessProgramCommitment: this.witnessProgramCommitment, value: this.value };
        return 'Output: ' + 'witness commitment:' + ' ' + output.witnessProgramCommitment + ' ' + 'value: +' + output.value;
    }
}

module.exports = Output;
