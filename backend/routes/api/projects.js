const express = require('express');
const router = express.Router();

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    // Mock data for now - replace with actual database query later
    const projects = [
      {
        id: 1,
        name: "Project Alpha",
        description: "A revolutionary privacy-focused project",
        fundingGoal: 50000,
        currentFunding: 25000,
        ownerAddress: "0x1234...5678",
        createdAt: new Date("2024-01-01"),
        category: "Technology",
        status: "active"
      },
      {
        id: 2,
        name: "Project Beta",
        description: "Decentralized marketplace solution",
        fundingGoal: 75000,
        currentFunding: 45000,
        ownerAddress: "0x8765...4321",
        createdAt: new Date("2024-02-01"),
        category: "DeFi",
        status: "active"
      },
      {
        id: 3,
        name: "Project Gamma",
        description: "Privacy-preserving social network",
        fundingGoal: 100000,
        currentFunding: 60000,
        ownerAddress: "0x9876...1234",
        createdAt: new Date("2024-03-01"),
        category: "Social",
        status: "active"
      }
    ];

    res.json({
      success: true,
      projects: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects'
    });
  }
});

// GET /api/projects/:id - Get a specific project
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock data for now - replace with actual database query later
    const project = {
      id: parseInt(id),
      name: "Project Alpha",
      description: "A revolutionary privacy-focused project",
      fundingGoal: 50000,
      currentFunding: 25000,
      ownerAddress: "0x1234...5678",
      createdAt: new Date("2024-01-01"),
      category: "Technology",
      status: "active",
      updates: [
        {
          id: 1,
          title: "First Milestone Reached",
          content: "We've completed the first phase of development",
          date: new Date("2024-02-01")
        }
      ],
      backers: [
        {
          address: "0xabcd...efgh",
          amount: 5000,
          date: new Date("2024-01-15")
        }
      ]
    };

    res.json({
      success: true,
      project: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project'
    });
  }
});

// POST /api/projects - Create a new project
router.post('/', async (req, res) => {
  try {
    const { name, description, fundingGoal, category } = req.body;

    // Validate required fields
    if (!name || !description || !fundingGoal || !category) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Mock project creation - replace with actual database insertion later
    const newProject = {
      id: Math.floor(Math.random() * 1000),
      name,
      description,
      fundingGoal,
      currentFunding: 0,
      ownerAddress: "0x1234...5678", // This would come from authenticated user
      createdAt: new Date(),
      category,
      status: "active"
    };

    res.status(201).json({
      success: true,
      project: newProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project'
    });
  }
});

module.exports = router; 