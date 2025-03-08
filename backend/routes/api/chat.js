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
    console.log('Received chat request:', req.body);
    const { message } = req.body;

    if (!message) {
      console.log('No message provided in request');
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    console.log('Calling Perplexity API with message:', message);
    // Get response from Perplexity API
    const aiResponse = await aiService.getChatResponse(message);
    console.log('Perplexity API response:', aiResponse);

    if (!aiResponse.success) {
      console.error('Perplexity API error:', aiResponse.error);
      throw new Error(aiResponse.error);
    }

    console.log('Sending successful response back to client:', aiResponse.text);
    res.json({
      success: true,
      response: aiResponse.text
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