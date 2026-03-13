const mongoose = require('mongoose');
require('dotenv').config();
const dbstring = process.env.DBSTRING;

// Function to connect to MongoDB using Mongoose

const connectDB = async () => {
    try {
        console.log('Connecting to the database...');
        await mongoose.connect(dbstring, {});
        console.log('Connected to the database successfully!✅');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};

module.exports = connectDB; 