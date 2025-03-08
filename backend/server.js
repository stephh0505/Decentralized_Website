/**
 * GhostFund Backend Server
 * Main Express.js application
 */

// Import required packages
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./config/db');

// Import blockchain service
const blockchainService = require('./services/blockchainService');

// Import routes
const projectRoutes = require('./routes/projectRoutes');

// Initialize Express app
const app = express();

// Connect to database
try {
  connectDB();
} catch (error) {
  console.error('Failed to connect to database:', error);
  console.warn('Running without database connection. Some features may not work.');
}

// Initialize blockchain service
try {
  const initialized = blockchainService.initialize();
  if (!initialized) {
    console.warn('Blockchain service not fully initialized. Running in development mode with limited functionality.');
  }
} catch (error) {
  console.error('Failed to initialize blockchain service:', error);
  console.warn('Running without blockchain service. Some features may not work.');
}

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.use(morgan('dev')); // HTTP request logger

// API Routes
app.use('/api/projects', projectRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Any route not matched by API routes will serve the frontend
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
}); 