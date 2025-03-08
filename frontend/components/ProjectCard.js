/**
 * ProjectCard Component
 * Displays information about a project in a card format
 */

import React from 'react';
import { useRouter } from 'next/router';
import FundButton from './FundButton';

/**
 * ProjectCard component displays project information in a card format
 * @param {Object} props - Component props
 * @param {Object} props.project - Project data to display
 * @param {boolean} props.showFundButton - Whether to show the fund button
 */
const ProjectCard = ({ project, showFundButton = true }) => {
  const router = useRouter();

  // Calculate funding progress percentage
  const progressPercentage = (project.currentFunding / project.fundingGoal) * 100;
  
  // Format currency values
  const formatCurrency = (value) => {
    return `${parseFloat(value).toFixed(2)} ETH`;
  };
  
  // Handle click on the card to navigate to project details
  const handleCardClick = () => {
    router.push(`/projects/${project._id}`);
  };

  return (
    <div 
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      onClick={handleCardClick}
    >
      {/* Project Header */}
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-xl font-semibold text-white truncate">
          {project.title}
        </h3>
        <p className="text-gray-400 mt-1 text-sm">
          {project.isAnonymous ? 'Anonymous Creator' : `Created by: ${project.ownerAddress.substring(0, 6)}...${project.ownerAddress.substring(38)}`}
        </p>
      </div>
      
      {/* Project Description */}
      <div className="p-6">
        <p className="text-gray-300 mb-4 line-clamp-3">
          {project.description}
        </p>
        
        {/* Funding Progress */}
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-gray-400 text-sm">
              {formatCurrency(project.currentFunding)} raised
            </span>
            <span className="text-gray-400 text-sm">
              {formatCurrency(project.fundingGoal)} goal
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          
          <p className="text-gray-400 text-sm mt-1">
            {progressPercentage.toFixed(1)}% funded
          </p>
        </div>
        
        {/* Fund Button */}
        {showFundButton && (
          <div className="mt-6" onClick={(e) => e.stopPropagation()}>
            <FundButton project={project} />
          </div>
        )}
      </div>
      
      {/* Project Footer */}
      <div className="bg-gray-900 px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {project.tags && project.tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="text-gray-400 text-sm">
            {project.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 