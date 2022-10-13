const net = require('net');
const buffer = require('buffer/').Buffer;

const Networking = {
    // Broadcast a rawTxBuffer to a sentinel at specified host {hostURL} and port {port} number 
    // make sure to include the size of the rawTxBuffer before sending to the sentinel
    broadcastTx: (port, host, signedTxHex) => {

        const client = new net.Socket();

        client.connect(port, host, () => {
            console.log('Connected');
            const requestId = Math.round(Math.random() * 10000000);
            const reqIdBuf = buffer.alloc(8);
            reqIdBuf.writeBigUInt64LE(BigInt(requestId));
            const sizePacket = buffer.alloc(8);
            const signedTxBuffer = buffer.from(signedTxHex, 'hex');
            sizePacket.writeBigUInt64LE(BigInt(signedTxBuffer.length + reqIdBuf.length));
            const finalPacket = buffer.concat([sizePacket, reqIdBuf, signedTxBuffer]);

            client.write(finalPacket, (err) => {
                console.log('Error', err);
            });
        });

        client.on('data', (data) => {
            console.log('Received: ' + data.toString('hex'));
            client.destroy(); // kill client after server's response
        });

        client.on('close', () => {
            console.log('Connection closed');
        });

        client.on('error', (err) => {
            console.error(err);
        });
    },
};

module.exports = Networking;
