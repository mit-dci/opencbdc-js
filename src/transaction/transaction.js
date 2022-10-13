const schnorr = require('bip-schnorr');
const crypto = require('crypto');
const buffer = require('buffer/').Buffer;
const Input = require('./input');
const Output = require('./output');
const Secp256k1 = require('@enumatech/secp256k1-js');

class Transaction {
    /**
     * 
     * @param {Array(Inputs)} inputs Array(Input) of Inputs objects
     * @param {Array(Outputs)} outputs Array(Outputs) of Output Objects
     * @param {Array} Array of Witness Object data for Transaction (req: should be ordered according to input data)
     */
    constructor(inputs, outputs, witnesses) {
        this.inputs = inputs;
        this.outputs = outputs;
        this.witnesses = witnesses || [];
    }

    /**
     * Get Hexadecimal version of transaction
     * @return {string} version of tx in hexadecimal format
     */
    toHex() {
        // Buffer concat necessary information to bytes
        let ary = [];

        // inputs
        if (!'inputs' in this || !Array.isArray(this.inputs))
            throw new Error('object doesn\'t contain inputs');

        const inbuf = buffer.alloc(8);
        inbuf.writeBigUInt64LE(BigInt(this.inputs.length));
        ary.push(inbuf);

        for (let i=0; i<this.inputs.length; i++) {
            if ( !'tx_hash' in this.inputs[i]
                || !'index' in this.inputs[i]
                || !'witnessProgramCommitment' in this.inputs[i]
                || !'value' in this.inputs[i] )
                throw new Error('input '+i+' doesn\'t contain tx_hash, index, witnessProgramCommitment, value');
            else {
                console.log(this.inputs[i].tx_hash);
                const tx_hash = buffer.from(this.inputs[i].tx_hash, 'hex');
                const index = buffer.alloc(8);
                index.writeBigUInt64LE(BigInt(this.inputs[i].index));
                const witnessProgramCommitment = buffer.from(this.inputs[i].witnessProgramCommitment, 'hex');
                const value = buffer.alloc(8);
                value.writeBigUInt64LE(BigInt(this.inputs[i].value));

                const buf = buffer.concat([tx_hash, index, witnessProgramCommitment, value]);
                ary.push(buf);
            }
        }

        // outputs
        if (! 'outputs' in this || !Array.isArray(this.outputs))
            throw new Error('object doesn\'t contain outputs');

        const outbuf =  buffer.alloc(8);
        outbuf.writeBigUInt64LE(BigInt(this.outputs.length));
        ary.push(outbuf);

        for (let i=0; i<this.outputs.length; i++) {
            if ( !'witnessProgramCommitment' in this.outputs[i]
                || !'value' in this.outputs[i] )
                throw new Error('output '+i+' doesn\'t contain witnessProgramCommitment, value');
            else {
                const witnessProgramCommitment = buffer.from(this.outputs[i].witnessProgramCommitment, 'hex');
                const value = buffer.alloc(8);
                value.writeBigUInt64LE(BigInt(this.outputs[i].value));

                const buf = buffer.concat([witnessProgramCommitment, value]);
                ary.push(buf);
            }
        }

        // witnesses
        if (! 'witnesses' in this || !Array.isArray(this.witnesses))
            throw new Error('object doesn\'t contain witnesses');

        const witnessbuf = buffer.alloc(8);
        witnessbuf.writeBigUInt64LE(BigInt(this.witnesses.length));
        ary.push(witnessbuf);

        for (let i=0; i<this.witnesses.length; i++) {
            if ( !'witness_length' in this.witnesses[i]
                || !'script_type' in this.witnesses[i]
                || !'pubkey' in this.witnesses[i]
                || !'signature' in this.witnesses[i] )
                throw new Error('witness '+i+' doesn\'t contain witness_length, script_type, pubkey, signature');
            else {
                const witness_length = buffer.alloc(8);
                witness_length.writeBigUInt64LE(BigInt(this.witnesses[i].witness_length));
                const script_type = buffer.from([this.witnesses[i].script_type]);
                const pubkey = buffer.from(this.witnesses[i].pubkey, 'hex');
                const signature = buffer.from(this.witnesses[i].signature, 'hex');

                const buf = buffer.concat([witness_length, script_type, pubkey, signature]);
                ary.push(buf);
            }

        }

        return buffer.concat(ary).toString('hex');
    }

    /**
     * 
     * @returns {string} hexadecimal txid for the current transaction
     */
    getTxid() {
        const hash = crypto.createHash('sha256');
        let ary = [];

        // inputs
        if (!Array.isArray(this.inputs))
            throw new Error('object doesn\'t contain inputs');

        const inputLen = buffer.alloc(8);
        inputLen.writeBigUInt64LE(BigInt(this.inputs.length));
        ary.push(inputLen);

        for (let i=0; i<this.inputs.length; i++) {
            if ( !'tx_hash' in this.inputs[i]
                || !'index' in this.inputs[i]
                || !'witnessProgramCommitment' in this.inputs[i]
                || !'value' in this.inputs[i] )
                throw new Error('input '+i+' doesn\'t contain tx_hash, index, witnessProgramCommitment, value');
            else {
                console.log('Trying out tx_hash: ', this.inputs[i].tx_hash);
                const tx_hash = buffer.from(this.inputs[i].tx_hash, 'hex');
                const index = buffer.allocUnsafe(8);
                index.writeBigUInt64LE(BigInt(this.inputs[i].index));
                const witnessProgramCommitment = Buffer.from(this.inputs[i].witnessProgramCommitment, 'hex');
                const value = buffer.allocUnsafe(8);
                value.writeBigUInt64LE(BigInt(this.inputs[i].value));

                const buf = buffer.concat([tx_hash, index, witnessProgramCommitment, value]);
                ary.push(buf);
            }
        }

        // outputs
        if (! 'outputs' in this || !Array.isArray(this.outputs))
            throw new Error('object doesn\'t contain outputs');

        const outputLen = buffer.alloc(8);
        outputLen.writeBigUInt64LE(BigInt(this.outputs.length));
        ary.push(outputLen);

        for (let i=0; i<this.outputs.length; i++) {
            if ( !'witnessProgramCommitment' in this.outputs[i]
                || !'value' in this.outputs[i] )
                throw new Error('output '+i+' doesn\'t contain witnessProgramCommitment, value');
            else {
                const witnessProgramCommitment = Buffer.from(this.outputs[i].witnessProgramCommitment, 'hex');
                const value = buffer.allocUnsafe(8);
                value.writeBigUInt64LE(BigInt(this.outputs[i].value));

                const buf = buffer.concat([witnessProgramCommitment, value]);
                ary.push(buf);
            }

        }

        hash.update(buffer.concat(ary));

        return hash.digest('hex');
    }

    /**
     * 
     * @param {string} rawHex transaction in valid hexadecimal format
     * @return {Transaction}
     */
    static txFromHex(rawHex) {
        let o = {};
        let i = 0;
        const buf = buffer.from(rawHex, 'hex');

        // inputs
        const inputs = buf.readBigUInt64LE(i);
        i=i+8;
        o.inputs = [];
        for (let x=0; x<inputs; x++) {
            // read each input
            const tx_hash = buf.subarray(i, i+32).toString('hex');
            i = i + 32;
            const index = buf.readBigUInt64LE(i);
            i = i + 8;
            const witnessProgramCommitment = buf.subarray(i, i+32).toString('hex');
            i = i + 32;
            const value = buf.readBigUInt64LE(i);
            i = i + 8;
            o.inputs.push(new Input(tx_hash, index, witnessProgramCommitment, value));
        }

        // outputs
        const outputs = buf.readBigUInt64LE(i);
        i=i+8;
        o.outputs = [];
        for (let x=0; x<outputs; x++) {
            // read each output
            const witnessProgramCommitment = buf.subarray(i, i+32).toString('hex');
            i = i + 32;
            const value = buf.readBigUInt64LE(i);
            i = i + 8;
            o.outputs.push(new Output(witnessProgramCommitment, value));
        }

        // witnesses
        const witnesses = buf.readBigUInt64LE(i);
        i=i+8;
        o.witnesses = [];
        for (let x=0; x<witnesses; x++) {
            // read each witness
            const witness_length = buf.readBigUInt64LE(i);
            i = i + 8;
            const script_type = buf.readInt8(i);
            i++;
            const pubkey = buf.subarray(i, i+32).toString('hex');
            i = i + 32;
            const signature = buf.subarray(i, i+64).toString('hex');
            i = i + 64;
            o.witnesses.push({witness_length: witness_length, script_type: script_type, pubkey: pubkey, signature: signature});
        }

        return new Transaction(o.inputs, o.outputs, o.witnesses);
    }   

    /**
     * 
     * @param {*} secretKey valid hex string
     * @return Buffer - signed tx 
     */
    sign(secretKey) {
        // TODO hexadecimal version of unsigned tx

        let tx_hash = this.getTxid();
        const pubHex = Secp256k1.generatePublicKeyFromPrivateKeyData(Secp256k1.uint256(secretKey, 16)).x;
        for (let i=0; i<this.inputs.length; i++) {
            console.log(tx_hash);
            let tx_hash_buf = Buffer.from(tx_hash, 'hex'); // switch to node js buffer so schnorr module recognizes buffer; TODO must fix so one Buffer is used throughout
            console.log(tx_hash_buf);
            console.log(tx_hash_buf.length);
            const sig = schnorr.sign(secretKey, tx_hash_buf);

            this.witnesses.push(
                { witness_length: BigInt(97),
                    script_type: 0,
                    pubkey: pubHex,
                    signature: sig.toString('hex') });

        }
        return this;
    }
}

module.exports = Transaction;