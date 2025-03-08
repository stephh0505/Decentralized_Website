/**
 * Project Model
 * MongoDB schema for projects in the GhostFund platform
 */

const mongoose = require('mongoose');

/**
 * Project Schema
 * Defines the structure for project documents in MongoDB
 */
const projectSchema = new mongoose.Schema({
  // Basic project information
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  
  // Funding information
  fundingGoal: {
    type: Number,
    required: [true, 'Funding goal is required'],
    min: [0, 'Funding goal must be a positive number']
  },
  currentFunding: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Blockchain information
  ownerAddress: {
    type: String,
    required: [true, 'Owner wallet address is required'],
    trim: true
  },
  contractAddress: {
    type: String,
    trim: true
  },
  
  // Status and timestamps
  status: {
    type: String,
    enum: ['draft', 'active', 'funded', 'cancelled'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Additional project details
  category: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Privacy settings
  isAnonymous: {
    type: Boolean,
    default: false
  },
  
  // Funding transactions
  transactions: [{
    funderAddress: String,
    amount: Number,
    timestamp: {
      type: Date,
      default: Date.now
    },
    transactionHash: String
  }]
});

// Pre-save middleware to update the updatedAt field
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the Project model
const Project = mongoose.model('Project', projectSchema);
module.exports = Project; 