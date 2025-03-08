/**
 * Project Detail Page
 * Displays detailed information about a specific project
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getProjectById } from '../../utils/api';
import FundButton from '../../components/FundButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import Layout from '../../components/Layout';

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  // State
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch project data when ID is available
  useEffect(() => {
    if (!id) return;
    
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const response = await getProjectById(id);
        
        if (response.success) {
          setProject(response.project);
        } else {
          setError(response.error || 'Failed to fetch project');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('An error occurred while fetching the project');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [id]);
  
  // Format currency values
  const formatCurrency = (value) => {
    return `${parseFloat(value).toFixed(2)} ETH`;
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Calculate funding progress percentage
  const calculateProgress = () => {
    if (!project) return 0;
    return (project.currentFunding / project.fundingGoal) * 100;
  };
  
  // Calculate time remaining
  const calculateTimeRemaining = () => {
    if (!project || !project.deadline) return 'No deadline';
    
    const now = new Date();
    const deadline = new Date(project.deadline);
    const diffTime = deadline - now;
    
    if (diffTime <= 0) return 'Ended';
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
    } else {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} left`;
    }
  };
  
  return (
    <Layout
      title={project ? `${project.title} | GhostFund` : 'Project | GhostFund'}
      description={project ? project.description.substring(0, 160) : 'Project details on GhostFund'}
      pageTitle="Project Details"
    >
      {/* Main Content */}
      <div className="container mx-auto px-4">
        {isLoading ? (
          // Loading state
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" text="Loading project details..." />
          </div>
        ) : error ? (
          // Error state
          <div className="max-w-2xl mx-auto">
            <ErrorMessage message={error} />
            <div className="text-center mt-6">
              <button
                onClick={() => router.push('/projects')}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              >
                Back to Projects
              </button>
            </div>
          </div>
        ) : project ? (
          // Project details
          <div className="max-w-4xl mx-auto">
            {/* Project Status Badge */}
            <div className="mb-6 flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                project.status === 'active' ? 'bg-blue-600' :
                project.status === 'funded' ? 'bg-green-600' :
                project.status === 'cancelled' ? 'bg-red-600' : 'bg-gray-600'
              }`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
              <span className="text-gray-400">
                Created on {formatDate(project.createdAt)}
              </span>
            </div>
            
            {/* Project Title */}
            <h2 className="text-4xl font-bold mb-4">{project.title}</h2>
            
            {/* Project Creator */}
            <p className="text-gray-400 mb-8">
              {project.isAnonymous 
                ? 'Created by Anonymous'
                : `Created by ${project.ownerAddress.substring(0, 6)}...${project.ownerAddress.substring(38)}`
              }
            </p>
            
            {/* Funding Progress */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(project.currentFunding)}
                  </p>
                  <p className="text-gray-400">
                    of {formatCurrency(project.fundingGoal)} goal
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-2xl font-bold text-white">
                    {calculateTimeRemaining()}
                  </p>
                  <p className="text-gray-400">
                    Deadline: {formatDate(project.deadline)}
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                <div 
                  className="bg-green-600 h-4 rounded-full" 
                  style={{ width: `${Math.min(calculateProgress(), 100)}%` }}
                ></div>
              </div>
              <p className="text-gray-400 text-sm">
                {calculateProgress().toFixed(1)}% funded
              </p>
              
              {/* Fund Button */}
              {project.status === 'active' && (
                <div className="mt-6">
                  <FundButton project={project} />
                </div>
              )}
            </div>
            
            {/* Project Description */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">About This Project</h3>
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-line">{project.description}</p>
              </div>
            </div>
            
            {/* Project Details */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Project Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Category</p>
                  <p className="font-semibold">
                    {project.category ? project.category.charAt(0).toUpperCase() + project.category.slice(1) : 'Other'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Privacy</p>
                  <p className="font-semibold">
                    {project.isAnonymous ? 'Anonymous' : 'Public'}
                  </p>
                </div>
                {project.contractAddress && (
                  <div className="col-span-2">
                    <p className="text-gray-400">Contract Address</p>
                    <p className="font-mono text-sm break-all">
                      {project.contractAddress}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-400 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Funding Transactions */}
            {project.transactions && project.transactions.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Funding Transactions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-700">
                        <th className="pb-2">Funder</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.transactions.map((tx, index) => (
                        <tr key={index} className="border-b border-gray-700">
                          <td className="py-3">
                            {tx.funderAddress 
                              ? `${tx.funderAddress.substring(0, 6)}...${tx.funderAddress.substring(38)}`
                              : 'Anonymous'
                            }
                          </td>
                          <td className="py-3">{formatCurrency(tx.amount)}</td>
                          <td className="py-3">{formatDate(tx.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          // No project found
          <EmptyState 
            message="Project not found"
            icon="error"
            action={{
              text: "Browse Projects",
              href: "/projects"
            }}
          />
        )}
      </div>
    </Layout>
  );
} 