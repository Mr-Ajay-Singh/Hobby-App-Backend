const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

const DB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/invictus';

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to Mongoose.');
    } catch (error) {
        console.error('Error in Mongoose connection:', error);
        throw error;
    }
};

module.exports = connectToDatabase;
