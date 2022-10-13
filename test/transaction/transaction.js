const expect = require('chai').expect;
const Transaction = require('../../src/transaction/transaction');
const Input = require('../../src/transaction/input');
const Output = require('../../src/transaction/output');

describe('Transaction', function() {
    it('test tx creation', function() {
        const input = new Input('123456', 0, 'abcdef1234', 10000);
        const output = new Output('abdcefg', 10000);
        let tx = new Transaction([input], [output], []);
        expect(tx).to.be.not.null;
    });

    it('unsigned tx from hex test', function() {
        const unsignedRawTx = '01000000000000009f981e64afc0fc56a0d7b355cd9eba36f3d19507088713b1f73afc5bf301a44e000000000000000070cd87ebaaa0d2d059dccaceeb7f9f823a5791d60b00aef9d9573f1fbf91ca29c800000000000000010000000000000081b095a242974d9f4e98ca18b468b8e644e4168380a035b3d66bc279b36c6510c8000000000000000000000000000000';
        const tx2 = Transaction.txFromHex(unsignedRawTx);
        const expectedSignedTx = '01000000000000009f981e64afc0fc56a0d7b355cd9eba36f3d19507088713b1f73afc5bf301a44e000000000000000070cd87ebaaa0d2d059dccaceeb7f9f823a5791d60b00aef9d9573f1fbf91ca29c800000000000000010000000000000081b095a242974d9f4e98ca18b468b8e644e4168380a035b3d66bc279b36c6510c80000000000000001000000000000006100000000000000003ad8f015f9212f8262248af4cf4cc39907d0215fdde14507f8bc09ad5836bbe901986cc97272bdb7624a824afcef76936b8f945e55d6e8479b95c81298e77b42d5a255e8529fc2f0d90743e7f9997a7159b6121105c7ec9b9252da992f34611f';
        const secretKey = 'e00b5c3d80899217a22fea87e7337907203df8a1efebd4d2a8773c8f629fff36';
        tx2.sign(secretKey);
        expect(tx2.toHex()).equal(expectedSignedTx);
    });

    it('signed tx from hex test, (txid, txToHex equality)', function() {
        let rawTx = '01000000000000009f981e64afc0fc56a0d7b355cd9eba36f3d19507088713b1f73afc5bf301a44e000000000000000070cd87ebaaa0d2d059dccaceeb7f9f823a5791d60b00aef9d9573f1fbf91ca29c800000000000000010000000000000081b095a242974d9f4e98ca18b468b8e644e4168380a035b3d66bc279b36c6510c8000000000000000000000000000000';
        let tx = Transaction.txFromHex(rawTx);
        expect(tx.toHex()).equal(rawTx);
        expect(tx.getTxid()).equal('12e01dfa90358fd203da3acbbe105b1ed2d249cd8e601ed919f4b8b2a99cbb02');
    });
});
