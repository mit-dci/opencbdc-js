const expect = require('chai').expect;
const Output = require('../../src/transaction/output');

describe('Output', function() {
    it('test output creation', function() {
        const output = new Output('abcdef', 0);
        expect(output.witnessProgramCommitment).equal('abcdef');
        expect(output.value).equal(0);
    });
});
