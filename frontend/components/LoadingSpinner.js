/**
 * Loading Spinner Component
 * Displays a loading spinner for async operations
 */

import React from 'react';

/**
 * LoadingSpinner component for indicating loading states
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the spinner (sm, md, lg)
 * @param {string} props.color - Color of the spinner
 * @param {string} props.text - Optional text to display below spinner
 */
const LoadingSpinner = ({ size = 'md', color = 'green', text }) => {
  // Determine size classes
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4'
  };
  
  // Determine color classes
  const colorClasses = {
    green: 'border-green-500',
    blue: 'border-blue-500',
    gray: 'border-gray-500',
    white: 'border-white'
  };
  
  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = colorClasses[color] || colorClasses.green;
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${spinnerSize} ${spinnerColor} rounded-full border-t-transparent animate-spin`}></div>
      {text && <p className="mt-3 text-gray-400">{text}</p>}
    </div>
  );
};

export default LoadingSpinner; 