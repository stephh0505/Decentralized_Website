/**
 * AI Service
 * Integration with Perplexity API for AI-powered features
 */

// Import required libraries
const axios = require('axios');

// Load environment variables
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai';

/**
 * Analyze project description for risk assessment
 * @param {string} projectDescription - The project description to analyze
 * @returns {Promise<Object>} - Risk assessment results
 */
exports.analyzeProjectRisk = async (projectDescription) => {
  try {
    if (!PERPLEXITY_API_KEY) {
      throw new Error('Perplexity API key is not configured');
    }

    // Prepare the prompt for risk analysis
    const prompt = `
      Analyze the following project description for potential risks:
      
      ${projectDescription}
      
      Please provide:
      1. Overall risk score (1-10)
      2. Identified red flags (if any)
      3. Legitimacy assessment
      4. Recommendation (approve/reject/review)
    `;

    // Make API request to Perplexity
    const response = await axios.post(
      `${PERPLEXITY_API_URL}/query`,
      {
        model: 'llama-3-sonar-small-online',
        prompt: prompt,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Process and return the analysis
    return {
      success: true,
      analysis: response.data.text,
      // Parse the response to extract structured data
      riskScore: parseRiskScore(response.data.text),
      recommendation: parseRecommendation(response.data.text)
    };
  } catch (error) {
    console.error('Error analyzing project with AI:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate project improvement suggestions
 * @param {string} projectDescription - The project description
 * @returns {Promise<Object>} - Improvement suggestions
 */
exports.generateProjectSuggestions = async (projectDescription) => {
  try {
    if (!PERPLEXITY_API_KEY) {
      throw new Error('Perplexity API key is not configured');
    }

    // Prepare the prompt for suggestions
    const prompt = `
      Review the following project description and provide constructive suggestions
      to improve its appeal to potential funders:
      
      ${projectDescription}
      
      Please provide:
      1. Three specific improvements for clarity
      2. Two suggestions to increase credibility
      3. One recommendation for better presentation
    `;

    // Make API request to Perplexity
    const response = await axios.post(
      `${PERPLEXITY_API_URL}/query`,
      {
        model: 'llama-3-sonar-small-online',
        prompt: prompt,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Return the suggestions
    return {
      success: true,
      suggestions: response.data.text
    };
  } catch (error) {
    console.error('Error generating project suggestions:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get a response from the chat AI
 * @param {string} message - The user's message
 * @returns {Promise<Object>} - Chat response
 */
exports.getChatResponse = async (message) => {
  try {
    if (!PERPLEXITY_API_KEY) {
      throw new Error('Perplexity API key is not configured');
    }

    console.log('Making request to Perplexity API');
    // Make API request to Perplexity
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'sonar-small-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant for GhostFund, a privacy-focused crowdfunding platform. Help users with their questions about creating and funding projects, privacy features, and platform functionality.'
          },
          {
            role: 'user',
            content: message
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Received response from Perplexity:', response.data);

    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error('Invalid response from Perplexity API');
    }

    return {
      success: true,
      text: response.data.choices[0].message.content
    };
  } catch (error) {
    console.error('Error in getChatResponse:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error || error.message
    };
  }
};

/**
 * Helper function to parse risk score from AI response
 * @param {string} analysisText - The raw analysis text
 * @returns {number} - Extracted risk score (1-10)
 */
function parseRiskScore(analysisText) {
  try {
    // Simple regex to find a risk score between 1-10
    const match = analysisText.match(/risk score.*?(\d+)/i);
    if (match && match[1]) {
      const score = parseInt(match[1]);
      return score >= 1 && score <= 10 ? score : 5;
    }
    return 5; // Default moderate risk if parsing fails
  } catch (error) {
    console.error('Error parsing risk score:', error);
    return 5;
  }
}

/**
 * Helper function to parse recommendation from AI response
 * @param {string} analysisText - The raw analysis text
 * @returns {string} - Extracted recommendation
 */
function parseRecommendation(analysisText) {
  try {
    // Look for recommendation keywords
    if (analysisText.toLowerCase().includes('approve')) {
      return 'approve';
    } else if (analysisText.toLowerCase().includes('reject')) {
      return 'reject';
    } else if (analysisText.toLowerCase().includes('review')) {
      return 'review';
    }
    return 'review'; // Default to review if parsing fails
  } catch (error) {
    console.error('Error parsing recommendation:', error);
    return 'review';
  }
} 