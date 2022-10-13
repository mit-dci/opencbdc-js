const buffer = require('buffer/').Buffer;

/* 
 * Input class represents the 'input' abstraction in digital currency transaction
 * in which it has a transaction hash (id of the transaction), index representing point in the tx, witnessProgramCommitment to reference from the UHS set and value indicating how much it is worth
 */
class Input {
    
    /**
     * @param tx_hash transaction id from which the input references it's unspent output
     * @param index of the input
     * @param witnessProgramCommitment of the input
     * @param value of the input
     * @return {Input}
     */
    constructor(tx_hash, index, witnessProgramCommitment, value)  {
        this.tx_hash = tx_hash;
        this.index = index;
        this.witnessProgramCommitment = witnessProgramCommitment;
        this.value = value;
    }
    /**
     * 
     * @returns {Buffer} input representation as buffer type
     */
    writeInputToBuffer() {
        const indexBuffer = buffer.alloc(8);
        indexBuffer.writeBigInt64LE(BigInt(this.index));
        const valueBuffer = buffer.alloc(8);
        valueBuffer.writeBigInt64LE(BigInt(this.value));

        return buffer.concat(
            [buffer.from(this.tx_hash, 'hex'), indexBuffer,
                buffer.from(this.witnessProgramCommitment, 'hex'), valueBuffer]);
    }

    bufStringHex() {
        const indexBuffer = buffer.alloc(8);
        indexBuffer.writeBigInt64LE(BigInt(this.index));
        const valueBuffer = buffer.alloc(8);
        valueBuffer.writeBigInt64LE(BigInt(this.value));

        return buffer.concat(
            [buffer.from(this.tx_hash, 'hex'), indexBuffer,
                buffer.from(this.witnessProgramCommitment, 'hex'), valueBuffer]).toString('hex');
    }

    /**
     * 
     * @returns {Buffer} returns Buffer representing Universal Hash Set Hash for this input
     */
    getUHSHash() {
        const hash = crypto.createHash('sha256');

        const index_buf = buffer.alloc(8);
        index_buf.writeBigUInt64LE(BigInt(this.index));
        const value_buf = buffer.alloc(8);
        value_buf.writeBigUInt64LE(BigInt(this.value));

        hash.update(buffer.concat([buffer.from(this.tx_hash, 'hex'), index_buf, buffer.from(this.witnessProgramCommitment, 'hex'), value_buf]));

        return hash.digest('hex');
    }

    /**
     * 
     * @returns string representation of input
     */
    toString() {
        const input = { tx_hash: this.tx_hash, index: this.index, witnessProgramCommitment: this.witnessProgramCommitment, value: this.value };
        return 'Input: tx_hash: ' + input.tx_hash + ' index: ' +  input.index + ' witness commitment: ' + input.witnessProgramCommitment + ' value: ' + input.value;
    }
}

module.exports = Input;
