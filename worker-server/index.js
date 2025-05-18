const nats = require('./services/nats');
const schedule = require('node-schedule');

console.log('Worker server started ✅');

// Catch any unhandled errors for debugging
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

nats.connect().then(() => {
    console.log('Connected to NATS from worker ✅');

    // Schedule job every 1 minute (for testing)
    schedule.scheduleJob('*/15 * * * *', () => {
        console.log('Publishing event at', new Date().toISOString());

        nats.publish('crypto.updates', { 
            event: 'CRYPTO_UPDATE',
            timestamp: new Date().toISOString()
        });
    });
}).catch((err) => {
    console.error('Failed to connect to NATS:', err);
});
