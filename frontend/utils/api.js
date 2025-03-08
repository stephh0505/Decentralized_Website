/**
 * API Utilities
 * Functions for making API calls to the backend
 */

import axios from 'axios';

// API base URL - will use environment variable in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Get all projects
 * @returns {Promise<Object>} Response with projects data
 */
export const getProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

/**
 * Get a project by ID
 * @param {string} projectId - The ID of the project to fetch
 * @returns {Promise<Object>} Response with project data
 */
export const getProjectById = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project ${projectId}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

/**
 * Create a new project
 * @param {Object} projectData - Project data to create
 * @returns {Promise<Object>} Response with created project
 */
export const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

/**
 * Fund a project
 * @param {string} projectId - The ID of the project to fund
 * @param {number} amount - The amount to fund in ETH
 * @param {string} funderAddress - The Ethereum address of the funder
 * @returns {Promise<Object>} Response with transaction details
 */
export const fundProject = async (projectId, amount, funderAddress) => {
  try {
    const response = await api.post('/projects/fund', {
      projectId,
      amount,
      funderAddress
    });
    return {
      success: true,
      ...response.data
    };
  } catch (error) {
    console.error(`Error funding project ${projectId}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

/**
 * Generate a private transaction for funding
 * @param {string} projectId - The ID of the project to fund
 * @param {number} amount - The amount to fund in ETH
 * @returns {Promise<Object>} Response with private transaction details
 */
export const generatePrivateTransaction = async (projectId, amount) => {
  try {
    // This would call a backend endpoint that integrates with the mixer contract
    // For now, we'll simulate it with a direct call to the blockchain service
    const response = await api.post('/projects/private-fund', {
      projectId,
      amount
    });
    
    return {
      success: true,
      ...response.data
    };
  } catch (error) {
    console.error(`Error generating private transaction for project ${projectId}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

/**
 * Get AI analysis for a project description
 * @param {string} description - The project description to analyze
 * @returns {Promise<Object>} Response with AI analysis
 */
export const getProjectAnalysis = async (description) => {
  try {
    const response = await api.post('/projects/analyze', { description });
    return response.data;
  } catch (error) {
    console.error('Error getting project analysis:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

/**
 * Get AI suggestions for improving a project
 * @param {string} description - The project description
 * @returns {Promise<Object>} Response with AI suggestions
 */
export const getProjectSuggestions = async (description) => {
  try {
    const response = await api.post('/projects/suggestions', { description });
    return response.data;
  } catch (error) {
    console.error('Error getting project suggestions:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
}; 