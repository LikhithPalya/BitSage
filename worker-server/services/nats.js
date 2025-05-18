    const { connect } = require('nats');

    class NATSClient {
    constructor() {
    this.connection = null;
    }

    async connect() {
    try {
        this.connection = await connect({
        servers: process.env.NATS_URL || 'nats://localhost:4222'
        });
        
        console.log('Connected to NATS');
        return this.connection;
        
    } catch (err) {
        console.error('NATS connection failed:', err);
        throw err;
    }
    }

    async publish(subject, data) {
    if (!this.connection) await this.connect();
    this.connection.publish(subject, JSON.stringify(data));
    }

    async subscribe(subject, callback) {
    if (!this.connection) await this.connect();
    const sub = this.connection.subscribe(subject);

    (async () => {
        for await (const msg of sub) {
        try {
            const data = JSON.parse(msg.data);
            callback(data);
        } catch (err) {
            console.error('Message parse error:', err);
        }
        }
    })();

    return sub;
    }
    }

    module.exports = new NATSClient();