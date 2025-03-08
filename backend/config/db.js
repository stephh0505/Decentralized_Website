/**
 * Database Configuration
 * Handles connection to MongoDB database
 */

const mongoose = require('mongoose');

// Get MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ghostfund';

/**
 * Connect to MongoDB database
 * @returns {Promise} Mongoose connection promise
 */
const connectDB = async () => {
  try {
    // Configure Mongoose options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // Removed in newer Mongoose versions
      // useFindAndModify: false, // Removed in newer Mongoose versions
      autoIndex: process.env.NODE_ENV !== 'production', // Only create indexes in development
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(MONGODB_URI, options);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    
    // In development mode, don't exit the process
    if (process.env.NODE_ENV === 'production') {
      process.exit(1); // Exit with failure in production
    } else {
      console.warn('Running without database connection. Some features may not work.');
      // Return a mock connection for development
      return {
        connection: {
          host: 'mock-connection',
          mock: true
        }
      };
    }
  }
};

module.exports = connectDB; 