/**
 * Project Controller
 * Handles business logic for project creation and funding
 */

// Import necessary models and services
const Project = require('../models/Project');
const aiService = require('../services/aiService');
const blockchainService = require('../services/blockchainService');

/**
 * Create a new project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createProject = async (req, res) => {
  try {
    // Extract project data from request body
    const { 
      title, 
      description, 
      fundingGoal, 
      ownerAddress,
      duration = 30,
      isAnonymous = false,
      category = 'other',
      tags = []
    } = req.body;
    
    // Validate project data
    if (!title || !description || !fundingGoal || !ownerAddress) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required project information' 
      });
    }
    
    // Calculate deadline based on duration (in days)
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + parseInt(duration));
    
    // Create new project in database
    const project = await Project.create({
      title,
      description,
      fundingGoal,
      ownerAddress,
      currentFunding: 0,
      createdAt: new Date(),
      status: 'active',
      deadline,
      isAnonymous,
      category,
      tags
    });
    
    // Try to create the project on the blockchain (if configured)
    try {
      const blockchainResult = await blockchainService.createProject({
        title,
        description,
        fundingGoal,
        ownerAddress,
        duration
      });
      
      // If successful, update the project with blockchain info
      if (blockchainResult && blockchainResult.success) {
        project.contractAddress = blockchainResult.projectAddress;
        project.transactionHash = blockchainResult.transaction.hash;
        await project.save();
      }
    } catch (blockchainError) {
      // Log the error but continue - we can still save the project in our database
      console.warn('Blockchain project creation failed:', blockchainError);
      // We'll handle this as a "pending" blockchain project
    }
    
    // Return success response
    return res.status(201).json({ 
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error creating project',
      error: error.message
    });
  }
};

/**
 * Get all projects
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllProjects = async (req, res) => {
  try {
    // Get query parameters for filtering
    const { status, category, search } = req.query;
    
    // Build query object
    const query = {};
    
    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Add category filter if provided
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Add search filter if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Fetch projects from database with filters
    const projects = await Project.find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(100); // Limit to 100 projects for performance
    
    // Return projects
    return res.status(200).json({ 
      success: true,
      message: 'Projects retrieved successfully',
      projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error fetching projects',
      error: error.message
    });
  }
};

/**
 * Fund a project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.fundProject = async (req, res) => {
  try {
    // Extract funding data from request body
    const { projectId, amount, funderAddress } = req.body;
    
    // Validate funding data
    if (!projectId || !amount || !funderAddress) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required funding information' 
      });
    }
    
    // Find the project
    const project = await Project.findById(projectId);
    
    // Check if project exists
    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: 'Project not found' 
      });
    }
    
    // Check if project is active
    if (project.status !== 'active') {
      return res.status(400).json({ 
        success: false,
        message: `Project is ${project.status} and cannot be funded` 
      });
    }
    
    // Process funding through blockchain service
    const transaction = await blockchainService.processFunding(projectId, amount, funderAddress);
    
    // Update project funding in database
    project.currentFunding += parseFloat(amount);
    
    // Add transaction to project
    project.transactions.push({
      funderAddress,
      amount: parseFloat(amount),
      timestamp: new Date(),
      transactionHash: transaction.transaction.hash
    });
    
    // Check if project is now fully funded
    if (project.currentFunding >= project.fundingGoal) {
      project.status = 'funded';
    }
    
    // Save updated project
    await project.save();
    
    // Return success response
    return res.status(200).json({ 
      success: true,
      message: 'Project funded successfully',
      transaction: transaction.transaction,
      project
    });
  } catch (error) {
    console.error('Error funding project:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error processing funding',
      error: error.message
    });
  }
};

/**
 * Get project by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Fetch project from database
    const project = await Project.findById(projectId);
    
    // Check if project exists
    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: 'Project not found' 
      });
    }
    
    // Return project
    return res.status(200).json({ 
      success: true,
      message: 'Project retrieved successfully',
      project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error fetching project',
      error: error.message
    });
  }
};

/**
 * Analyze project description with AI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.analyzeProject = async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({ 
        success: false,
        message: 'Project description is required for analysis' 
      });
    }
    
    // Get AI analysis
    const analysis = await aiService.analyzeProjectRisk(description);
    
    if (!analysis.success) {
      return res.status(500).json({ 
        success: false,
        message: 'Failed to analyze project',
        error: analysis.error
      });
    }
    
    // Return analysis
    return res.status(200).json({ 
      success: true,
      message: 'Project analyzed successfully',
      ...analysis
    });
  } catch (error) {
    console.error('Error analyzing project:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error analyzing project',
      error: error.message
    });
  }
};

/**
 * Get project suggestions from AI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProjectSuggestions = async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({ 
        success: false,
        message: 'Project description is required for suggestions' 
      });
    }
    
    // Get AI suggestions
    const suggestions = await aiService.generateProjectSuggestions(description);
    
    if (!suggestions.success) {
      return res.status(500).json({ 
        success: false,
        message: 'Failed to generate suggestions',
        error: suggestions.error
      });
    }
    
    // Return suggestions
    return res.status(200).json({ 
      success: true,
      message: 'Suggestions generated successfully',
      ...suggestions
    });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error generating suggestions',
      error: error.message
    });
  }
}; 