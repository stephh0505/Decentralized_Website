/**
 * Project Routes
 * API endpoints for project-related operations
 */

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

/**
 * @route   GET /api/projects
 * @desc    Get all projects
 * @access  Public
 */
router.get('/', projectController.getAllProjects);

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post('/', projectController.createProject);

/**
 * @route   GET /api/projects/:projectId
 * @desc    Get a project by ID
 * @access  Public
 */
router.get('/:projectId', projectController.getProjectById);

/**
 * @route   POST /api/projects/fund
 * @desc    Fund a project
 * @access  Private
 */
router.post('/fund', projectController.fundProject);

/**
 * @route   POST /api/projects/analyze
 * @desc    Analyze a project description with AI
 * @access  Public
 */
router.post('/analyze', projectController.analyzeProject);

/**
 * @route   POST /api/projects/suggestions
 * @desc    Get suggestions for a project description
 * @access  Public
 */
router.post('/suggestions', projectController.getProjectSuggestions);

module.exports = router; 