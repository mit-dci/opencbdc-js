# opencbdc-js

This is a pure JS node module which reads and writes the binary transaction packet formats used in [opencbdc-tx](https://github.com/mit-dci/opencbdc-tx.git).
It also contains utilities to calculate UHS and transaction hashes from output data.

## Getting Started

* Clone the code
  ```console
  $ git clone "https://github.com/mit-dci/opencbdc-js.git"
  ```
* Install the necessary dependencies
  ```console
  $ npm install
  ```
* Run the test suite
  ```console
  $ npm test
  ```

## Contributing

Patches are welcome!
Please see [the OpenCBDC contribution guide](https://github.com/mit-dci/opencbdc-tx/blob/trunk/docs/contributing.md) for more information!

The following is a breakdown of sections and classes for this cbdc-module:

## Crypto
- Address
  - constructor(script_type, pubHex) - ```a new Address Object```
    - script_type - {Number} representing the script type of the address
    - pubHex - {String} represents valid 32 byte hexadecimal string
  - getAddress() - returns {String} ```represented the bech32 encoding version of a publickey e.g. ```
  - decodeAddress() - returns {Object} ```with fields script_type (string representing) and pubHex (hex string of public key)``` 

  - static decodeFromAddressString(address) - returns ```{Object} with fields script_type {Number} and pubHex {String} (hexdecimal string of public key)```
  
- Publickey
    - constructor(secretKeyData) - ```returns a new Publickey object```
        - secretKeyData - ```{String} a valid 32 byte hexadecimal string```
    - static fromPrivateKeyData(secretKeyData)
        - secretKeyData - ```{String} a valid 32 byte hexadecimal string```
    - toBuffer() - ```returns {Buffer} 32 byte buffer publickey```

- Secretkey
    - contructor(randBytes) - ```returns new SecretKey with randBytes provided as random seed (if provided), otherwise it creates random key from random secrety bytes```
        - randBytes - {Buffer} optional 32 bytes used to seed for privatekey, otherwise another random 
    - toString() -   ```returns {String} valid hexadecimal string of privatekey```
    - toBuffer() - ```returns {Buffer} valid 32 byte Buffer for privatekey```
    - static fromHex(secretKeyHex)- ``` returns {SecretKey} from secretKeyHex```
        - secretKeyHex - valid 32 byte hexadecimal string for privateKey
    - toHex() - ```returns hexadecimal representation of privateKey```


## Networking
* Networking
    - broadcastTx(port, host, signedTxHex) - ```broadcast a signedTxBuf to a sentinel server at host {host} and port {port} number```
        - port - {number} port number of host
        - host - {string} hostname url to send signedTx
        - signedTxHex - {string} a valid hexadecimal encoded transaction that has been signed

## Transaction
- Input
    - constructor(tx_hash, index, witnessProgramCommitment, value) ```returns new Input Object Type```
        - tx_hash - {String} valid hexadecimal string for transaction hash this input references
        - index - {number} index position of the input for tx
        - witnessProgramCommitment {String} - witness commitment for this input
        - value {number} - the number of dollar units this input is worth
    - writeInputToBuffer() - ```returns Buffer representation as buffer type```
    - getUHSHash() - ```returns {Buffer} Universal Hash Set hash of the input e.g. concatentation of [txid, index, witnessProgramCommitment, value] into bytes```
    e.g.
    - toString() - ```returns {String} representing valid input```

## Utils 
- Utility Methods CBDC module
    - sign(secretKey, message) - ```returns signature that signed message {message} with privateKey {privateKey}```
      - secretKey - {String} - 32 byte hexadecimal string
      - message - {String} - message that is signed
    - verify(publicKey, message, signature) ```returns true or false whether the produced signature is validly signed publicKey```
      - publicKey - 32 byte hexadecimal string
      - message - message to verify was signed
      - signature - {String} signature to verify validly signed message against public key message pair

*N.B.:* A hash is used to identify a specfic UTXO within the monetary supply (the UHS ID); it is a concatenation of a txid, a 64-bit index of the UTXO's position in previous tx's outputs, a witnessProgramCommitment, and the 64-bit encoded value of that output

- Output
  - constructor(witnessProgramCommitment, value) ```returns new Output Object type```
    - witnessProgramCommitment - {String}
    - value - {Number}
  - writeOutputToBuffer() - ```returns a Buffer representation of this output in raw bytes```
  - static fromOutputData(pubHex, value) - ```returns a new {Output} from publicKey and value provided```
    - pubHex - {String}
    - value - {Number}
  - toString() - ```returns {String} string representation of Output```

- Transaction
   - constructor(inputs, outputs, witnesses) - ```returns new {Transaction} object```
        - inputs - Array{Input}
        - outputs - Array{Output}
        - witnesses - Array of witness object
   - toHex() - ```returns {String} hexadecimal string of the unsigned raw transaction```
   - getTxid() - ```returns {String} returns hexadecimal string of transaction id (txid)```
   - sign(secretKey) - ```returns {Buffer} signed tx in bytes``` 
   - static txFromHex(rawHex)  - ```returns {Transaction} object from the provided rawTx```
        - rawHex - valid hexadecimal string represents a valid tx

## Special Notes
BigInt is used everywhere throughout this module, that may pose problems in using toJson() methods or serializing for output

## Example Usage
The following are example code snippets.

- Address
  ```js
  const addr = new Address('00', '3ad8f015f9212f8262248af4cf4cc39907d0215fdde14507f8bc09ad5836bbe9')
  
  console.log(addr.getAddress()); 
  usd1qqad3uq4lysjlqnzyj90fn6vcwvs05pptlw7z3g8lz7qnt2cx6a7jty6gr5
  
  console.log(addr.decodeAddress());
  
  { script_type: 0, pubHex: '3ad8f015f9212f8262248af4cf4cc39907d0215fdde14507f8bc09ad5836bbe9' }
  ```
- Publickey
  ```js
  const pub = new Publickey('e00b5c3d80899217a22fea87e7337907203df8a1efebd4d2a8773c8f629fff36')
  console.log(pub.toBuffer());
  ```
- Secretkey
  ```js
  const secKey = new SecretKey(Buffer.from(parseInt(Math.round(Math.random() * 10)), 'hex'));
  secKey.toString();
  secKey.toBuffer();
  ```

- Networking
  ```js
  let network = require('./networking/broadcast');
  const txBuf = new Transaction();
  Networking.broadcastTx(5555, '127.0.0.1', Buffer.from(tx.toHex(), 'hex'))
  ```
- Transaction
  ```js
  const input = new Input('9f981e64afc0fc56a0d7b355cd9eba36f3d19507088713b1f73afc5bf301a44e', 0, '70cd87ebaaa0d2d059dccaceeb7f9f823a5791d60b00aef9d9573f1fbf91ca29', 200)
  const output = new Output('81b095a242974d9f4e98ca18b468b8e644e4168380a035b3d66bc279b36c6510', 200)
  const tx = new Transaction([input], [output], []);
  tx.sign('e00b5c3d80899217a22fea87e7337907203df8a1efebd4d2a8773c8f629fff36')
  console.log(tx.getTxid());

  12e01dfa90358fd203da3acbbe105b1ed2d249cd8e601ed919f4b8b2a99cbb02

  console.log(tx);
  01000000000000009f981e64afc0fc56a0d7b355cd9eba36f3d19507088713b1f73afc5bf301a44e000000000000000070cd87ebaaa0d2d059dccaceeb7f9f823a5791d60b00aef9d9573f1fbf91ca29c800000000000000010000000000000081b095a242974d9f4e98ca18b468b8e644e4168380a035b3d66bc279b36c6510c80000000000000001000000000000006100000000000000003ad8f015f9212f8262248af4cf4cc39907d0215fdde14507f8bc09ad5836bbe901986cc97272bdb7624a824afcef76936b8f945e55d6e8479b95c81298e77b42d5a255e8529fc2f0d90743e7f9997a7159b6121105c7ec9b9252da992f34611f
  ```

  - Constructing, signing and broacasting tx to sentinel
    ```js
    const secretKey = 'e00b5c3d80899217a22fea87e7337907203df8a1efebd4d2a8773c8f629fff36';
    
    const input = new Input('9f981e64afc0fc56a0d7b355cd9eba36f3d19507088713b1f73afc5bf301a44e', 0, '70cd87ebaaa0d2d059dccaceeb7f9f823a5791d60b00aef9d9573f1fbf91ca29', 200)
    const output = new Output('81b095a242974d9f4e98ca18b468b8e644e4168380a035b3d66bc279b36c6510', 200)
    const tx = new Transaction([input], [output], []);
    
    tx.sign(secretKey);
    
    Networking.broadcastTx(5555, '127.0.0.1', Buffer.from(tx.toHex(), 'hex'))
    ```

  - Signing and Verifying
    ```js
    const secretKey = "e00b5c3d80899217a22fea87e7337907203df8a1efebd4d2a8773c8f629fff36";
    const publicKey = "3ad8f015f9212f8262248af4cf4cc39907d0215fdde14507f8bc09ad5836bbe9";
    const sha256 = function () {...};
    const message = 'onomatopoeia';

    const sig = utils.sign(secretKey, message);
    utils.verify(publicKey, Buffer.from(sha256(message), 'hex'), sig);
    ```

## Sample Data

### Secret and Related Public Key
```
secret key: e00b5c3d80899217a22fea87e7337907203df8a1efebd4d2a8773c8f629fff36
public key: 3ad8f015f9212f8262248af4cf4cc39907d0215fdde14507f8bc09ad5836bbe9
```

### Signed Transaction
```
01000000000000009f981e64afc0fc56a0d7b355cd9eba36f3d19507088713b1f73afc5bf301a44e000000000000000070cd87ebaaa0d2d059dccaceeb7f9f823a5791d60b00aef9d9573f1fbf91ca29c800000000000000010000000000000081b095a242974d9f4e98ca18b468b8e644e4168380a035b3d66bc279b36c6510c80000000000000001000000000000006100000000000000003ad8f015f9212f8262248af4cf4cc39907d0215fdde14507f8bc09ad5836bbe901986cc97272bdb7624a824afcef76936b8f945e55d6e8479b95c81298e77b42d5a255e8529fc2f0d90743e7f9997a7159b6121105c7ec9b9252da992f34611f
```

### Signed Transaction Decoded
```
Tx {
  inputs: [
    {
      tx_hash: '9f981e64afc0fc56a0d7b355cd9eba36f3d19507088713b1f73afc5bf301a44e',
      index: 0n,
      witness_program_commitment: '70cd87ebaaa0d2d059dccaceeb7f9f823a5791d60b00aef9d9573f1fbf91ca29',
      value: 200n
    }
  ],
  outputs: [
    {
      witness_program_commitment: '81b095a242974d9f4e98ca18b468b8e644e4168380a035b3d66bc279b36c6510',
      value: 200n
    }
  ],
  witnesses: [
    {
      witness_length: 97n,
      script_type: 0,
      pubkey: '3ad8f015f9212f8262248af4cf4cc39907d0215fdde14507f8bc09ad5836bbe9',
      signature: '01986cc97272bdb7624a824afcef76936b8f945e55d6e8479b95c81298e77b42d5a255e8529fc2f0d90743e7f9997a7159b6121105c7ec9b9252da992f34611f'
    }
  ]
}
```

