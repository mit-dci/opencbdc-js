const expect = require('chai').expect;
const Input = require('../../src/transaction/input');

describe('Input', function() {
    it('test input creation', function() {
        let input = new Input('abcdef', 0, '123456', 1000);
        expect(input.tx_hash).equal('abcdef');
        expect(input.index).equal(0);
        expect(input.witnessProgramCommitment).equal('123456');
        expect(input.value).equal(1000);
    });
});

