const utils = require('./utils');

const secretKey = 'e00b5c3d80899217a22fea87e7337907203df8a1efebd4d2a8773c8f629fff36';
const publicKey = '3ad8f015f9212f8262248af4cf4cc39907d0215fdde14507f8bc09ad5836bbe9';
const message = 'onomatopoeia';

const sig = utils.sign(secretKey, message);

console.log('Pubkey Buffer: ', Buffer.from(publicKey, 'hex'));
console.log('Signature', sig, sig.length);

console.log(utils.verify(publicKey, Buffer.from(utils.sha256(message), 'hex'), sig));