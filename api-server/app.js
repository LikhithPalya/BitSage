require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cryptoRoutes = require('./src/routes/cryptoRoutes.js');

const app = express();

// Middleware
app.use(express.json());

// Database connection
const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n MongoDB connection successful DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`Error occured while connecting to DB ${error}`)
        process.exit(1)
    }
}

connectDB()
    .then(()=>{
        app.on("error", ()=>{
            console.log("Not able to connect to DB");
            throw error;
        })
        app.listen(process.env.PORT || 8000, ()=>{
            console.log(`Server runnning at port ${process.env.PORT}`);
        })
    })
    .catch((error)=>{
        console.log("MongoDB connection failed " + error);
    })

    app.use('/api', cryptoRoutes);