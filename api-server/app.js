require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const nats = require('./src/services/nats');
const { storeCryptoStats } = require('./src/controllers/cryptoController');
const cryptoRoutes = require('./src/routes/cryptoRoutes');
const statsRoutes = require('./src/routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database Connection
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
        w: 'majority'
        });
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
};

// NATS Event Handler
const setupNATS = async () => {
    try {
        await nats.connect();
    
        nats.subscribe('crypto.updates', async (msg) => {
        console.log(`Received NATS event at ${new Date().toISOString()}`);
        await storeCryptoStats();
        });

        console.log('NATS subscription active');
    } catch (err) {
        console.error('NATS setup failed:', err);
        process.exit(1);
    }
};

// Server Startup
const start = async () => {
    try {
        await connectDB();
        await setupNATS();

        // Routes
        app.use('/api', cryptoRoutes);
        app.use('/api', statsRoutes);

        // Health Check
        app.get('/health', (req, res) => {
            res.status(200).json({
            status: 'healthy',
            mongo: mongoose.connection.readyState === 1,
            nats: nats.connection !== null
            });
        });

        // Error Handling Middleware
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Internal Server Error' });
        });

        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}`);
    });
    } catch (err) {
        console.error('Server startup failed:', err);
        process.exit(1);
    }
};

// Graceful Shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    await mongoose.connection.close();
    await nats.connection.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received. Shutting down gracefully...');
    await mongoose.connection.close();
    await nats.connection.close();
    process.exit(0);
});

start();