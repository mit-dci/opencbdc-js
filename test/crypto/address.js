const expect = require('chai').expect;
const Address = require('../../src/crypto/address');

describe('Address tests', function() {
    it('Simple address conversion', function() {
        const pubkeyHex = '3ad8f015f9212f8262248af4cf4cc39907d0215fdde14507f8bc09ad5836bbe9';
        const expectedAddress = 'usd1qqad3uq4lysjlqnzyj90fn6vcwvs05pptlw7z3g8lz7qnt2cx6a7jty6gr5';
        const address = new Address('00', pubkeyHex);
        expect(address.address).equal(expectedAddress);
    });

    it('Decode Address', function() {
        const pubkeyHex = '3ad8f015f9212f8262248af4cf4cc39907d0215fdde14507f8bc09ad5836bbe9';
        const address = new Address('00', pubkeyHex);
        const decodedAddress = address.decodeAddress();
        expect(decodedAddress.script_type).equal('00');
        expect(decodedAddress.pubkeyHex).equal(pubkeyHex);
    });
});
