/**
 * Empty State Component
 * Displays a message when no data is available
 */

import React from 'react';
import Link from 'next/link';

/**
 * EmptyState component for displaying when no data is available
 * @param {Object} props - Component props
 * @param {string} props.message - The message to display
 * @param {string} props.icon - Icon type to display (projects, search, error)
 * @param {Object} props.action - Action button configuration
 * @param {string} props.action.text - Button text
 * @param {string} props.action.href - Button link
 * @param {Function} props.action.onClick - Button click handler
 */
const EmptyState = ({ 
  message = 'No data available', 
  icon = 'projects',
  action
}) => {
  // Render the appropriate icon
  const renderIcon = () => {
    switch (icon) {
      case 'projects':
        return (
          <svg className="h-16 w-16 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'search':
        return (
          <svg className="h-16 w-16 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-16 w-16 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  // Render action button
  const renderAction = () => {
    if (!action) return null;
    
    if (action.href) {
      return (
        <Link href={action.href} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          {action.text || 'View All'}
        </Link>
      );
    }
    
    if (action.onClick) {
      return (
        <button
          onClick={action.onClick}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {action.text || 'Try Again'}
        </button>
      );
    }
    
    return null;
  };
  
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        {renderIcon()}
      </div>
      <h3 className="text-lg font-medium text-gray-300 mb-2">{message}</h3>
      {renderAction()}
    </div>
  );
};

export default EmptyState; 