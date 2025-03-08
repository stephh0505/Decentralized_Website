/**
 * Create Project Page
 * Form for creating a new crowdfunding project
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { createProject, getProjectAnalysis } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Layout from '../../components/Layout';

export default function CreateProject() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fundingGoal: '',
    duration: 30,
    isAnonymous: false,
    category: 'other',
    tags: ''
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle AI analysis of project description
  const handleAnalyzeProject = async (e) => {
    e.preventDefault();
    
    if (!formData.description || formData.description.length < 50) {
      setError('Please provide a detailed description (at least 50 characters) for analysis');
      return;
    }
    
    setIsAnalyzing(true);
    setError('');
    
    try {
      const response = await getProjectAnalysis(formData.description);
      
      if (response.success) {
        setAiAnalysis(response);
      } else {
        setError(response.error || 'Failed to analyze project');
      }
    } catch (err) {
      console.error('Error analyzing project:', err);
      setError('An error occurred while analyzing the project');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title) {
      setError('Project title is required');
      return;
    }
    
    if (!formData.description || formData.description.length < 100) {
      setError('Please provide a detailed description (at least 100 characters)');
      return;
    }
    
    if (!formData.fundingGoal || isNaN(formData.fundingGoal) || parseFloat(formData.fundingGoal) <= 0) {
      setError('Please enter a valid funding goal');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install it to continue.');
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const ownerAddress = accounts[0];
      
      // Prepare project data
      const projectData = {
        ...formData,
        fundingGoal: parseFloat(formData.fundingGoal),
        duration: parseInt(formData.duration),
        ownerAddress,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      // Create project
      const response = await createProject(projectData);
      
      if (response.success) {
        // Redirect to project page
        router.push(`/projects/${response.project._id}`);
      } else {
        setError(response.error || 'Failed to create project');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.message || 'An error occurred while creating the project');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout
      title="Create Project | GhostFund"
      description="Create a new anonymous crowdfunding project on GhostFund"
      pageTitle="Create Project"
    >
      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-6">
                <ErrorMessage message={error} />
              </div>
            )}
            
            {/* Project Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-gray-300 mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded py-2 px-3 focus:outline-none focus:border-green-500"
                placeholder="Enter a catchy title for your project"
                required
              />
            </div>
            
            {/* Project Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-300 mb-2">
                Project Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded py-2 px-3 focus:outline-none focus:border-green-500 h-40"
                placeholder="Describe your project in detail. What are you funding? Why is it important? How will the funds be used?"
                required
              ></textarea>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleAnalyzeProject}
                  disabled={isAnalyzing}
                  className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors duration-300 ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center">
                      <LoadingSpinner size="sm" color="white" />
                      <span className="ml-2">Analyzing...</span>
                    </span>
                  ) : 'Analyze with AI'}
                </button>
              </div>
            </div>
            
            {/* AI Analysis Results */}
            {aiAnalysis && (
              <div className="mb-6 p-4 bg-gray-700 rounded">
                <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
                <div className="mb-2">
                  <span className="font-medium">Risk Score:</span>{' '}
                  <span className={`font-bold ${aiAnalysis.riskScore <= 3 ? 'text-green-500' : aiAnalysis.riskScore <= 6 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {aiAnalysis.riskScore}/10
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-medium">Recommendation:</span>{' '}
                  <span className={`font-bold ${aiAnalysis.recommendation === 'approve' ? 'text-green-500' : aiAnalysis.recommendation === 'review' ? 'text-yellow-500' : 'text-red-500'}`}>
                    {aiAnalysis.recommendation.charAt(0).toUpperCase() + aiAnalysis.recommendation.slice(1)}
                  </span>
                </div>
                <div className="mt-3 text-sm text-gray-300">
                  <p>{aiAnalysis.analysis}</p>
                </div>
              </div>
            )}
            
            {/* Funding Goal */}
            <div className="mb-6">
              <label htmlFor="fundingGoal" className="block text-gray-300 mb-2">
                Funding Goal (ETH) <span className="text-red-500">*</span>
              </label>
              <input
                id="fundingGoal"
                name="fundingGoal"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.fundingGoal}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded py-2 px-3 focus:outline-none focus:border-green-500"
                placeholder="0.1"
                required
              />
            </div>
            
            {/* Project Duration */}
            <div className="mb-6">
              <label htmlFor="duration" className="block text-gray-300 mb-2">
                Duration (Days) <span className="text-red-500">*</span>
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                min="1"
                max="365"
                value={formData.duration}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded py-2 px-3 focus:outline-none focus:border-green-500"
                required
              />
            </div>
            
            {/* Category */}
            <div className="mb-6">
              <label htmlFor="category" className="block text-gray-300 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded py-2 px-3 focus:outline-none focus:border-green-500"
              >
                <option value="technology">Technology</option>
                <option value="art">Art</option>
                <option value="music">Music</option>
                <option value="film">Film</option>
                <option value="games">Games</option>
                <option value="publishing">Publishing</option>
                <option value="social">Social Cause</option>
                <option value="business">Business</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {/* Tags */}
            <div className="mb-6">
              <label htmlFor="tags" className="block text-gray-300 mb-2">
                Tags (comma separated)
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded py-2 px-3 focus:outline-none focus:border-green-500"
                placeholder="blockchain, privacy, art"
              />
            </div>
            
            {/* Privacy Toggle */}
            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    className="sr-only"
                    checked={formData.isAnonymous}
                    onChange={handleChange}
                  />
                  <div className={`block w-10 h-6 rounded-full ${formData.isAnonymous ? 'bg-green-600' : 'bg-gray-600'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${formData.isAnonymous ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3 text-gray-300">
                  Create anonymously
                </div>
              </label>
              <p className="text-gray-400 text-xs mt-1 ml-14">
                {formData.isAnonymous 
                  ? 'Your identity will be hidden from project viewers'
                  : 'Your wallet address will be visible on the project page'
                }
              </p>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="sm" color="white" />
                    <span className="ml-2">Creating Project...</span>
                  </span>
                ) : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
} 