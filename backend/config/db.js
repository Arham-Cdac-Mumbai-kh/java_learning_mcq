const mongoose = require('mongoose');

const connectDb = async () => {
    if (!process.env.MONGO_URI) {
        console.log('MONGO_URI not set. Using local JSON data files.');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

const isMongoConnected = () => mongoose.connection.readyState === 1;

module.exports = { connectDb, isMongoConnected };
