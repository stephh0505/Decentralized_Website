const express = require('express');
const cors = require('cors');
const chatRouter = require('./routes/api/chat');
const projectsRouter = require('./routes/api/projects');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRouter);
app.use('/api/projects', projectsRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something broke!'
  });
});

module.exports = app; 