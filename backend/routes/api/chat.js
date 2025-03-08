/**
 * Chat API Routes
 * Handles chat interactions using Perplexity API
 */

const express = require('express');
const router = express.Router();
const aiService = require('../../services/aiService');

/**
 * POST /api/chat
 * Send a message to the chat AI
 */
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Get response from Perplexity API
    const response = await aiService.getChatResponse(message);

    if (!response.success) {
      throw new Error(response.error);
    }

    res.json({
      success: true,
      response: response.text
    });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get chat response'
    });
  }
});

module.exports = router; 