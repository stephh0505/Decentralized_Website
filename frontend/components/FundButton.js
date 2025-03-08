/**
 * FundButton Component
 * Button for funding projects with privacy options
 */

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { fundProject, generatePrivateTransaction } from '../utils/api';

/**
 * FundButton component provides UI for funding projects
 * @param {Object} props - Component props
 * @param {Object} props.project - Project data to fund
 */
const FundButton = ({ project }) => {
  // State variables
  const [amount, setAmount] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [privateTransactionData, setPrivateTransactionData] = useState(null);
  
  // Handle opening the funding modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };
  
  // Handle closing the funding modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAmount('');
    setError('');
    setSuccess('');
    setPrivateTransactionData(null);
  };
  
  // Handle amount input change
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };
  
  // Handle privacy toggle
  const handlePrivacyToggle = () => {
    setIsPrivate(!isPrivate);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate amount
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install it to continue.');
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const funderAddress = accounts[0];
      
      if (isPrivate) {
        // Generate private transaction
        const response = await generatePrivateTransaction(project._id, amount);
        
        if (response.success) {
          setPrivateTransactionData(response);
          setSuccess('Private transaction details generated. Follow the instructions to complete your funding.');
        } else {
          throw new Error(response.error || 'Failed to generate private transaction');
        }
      } else {
        // Regular funding transaction
        const response = await fundProject(project._id, amount, funderAddress);
        
        if (response.success) {
          setSuccess('Project funded successfully!');
        } else {
          throw new Error(response.error || 'Failed to fund project');
        }
      }
    } catch (err) {
      console.error('Funding error:', err);
      setError(err.message || 'An error occurred while funding the project');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      {/* Fund Button */}
      <button
        onClick={handleOpenModal}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
      >
        Fund This Project
      </button>
      
      {/* Funding Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">
              Fund Project: {project.title}
            </h3>
            
            {/* Funding Form */}
            <form onSubmit={handleSubmit}>
              {/* Amount Input */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  Amount (ETH)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded py-2 px-3 focus:outline-none focus:border-green-500"
                  placeholder="0.1"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>
              
              {/* Privacy Toggle */}
              <div className="mb-6">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isPrivate}
                      onChange={handlePrivacyToggle}
                    />
                    <div className={`block w-10 h-6 rounded-full ${isPrivate ? 'bg-green-600' : 'bg-gray-600'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${isPrivate ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-300">
                    Enable privacy (anonymous funding)
                  </div>
                </label>
                <p className="text-gray-400 text-xs mt-1 ml-14">
                  {isPrivate 
                    ? 'Your funding will be anonymized using a mixer contract'
                    : 'Your wallet address will be visible on the blockchain'
                  }
                </p>
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="mb-4 text-red-500 text-sm">
                  {error}
                </div>
              )}
              
              {/* Success Message */}
              {success && (
                <div className="mb-4 text-green-500 text-sm">
                  {success}
                </div>
              )}
              
              {/* Private Transaction Instructions */}
              {privateTransactionData && (
                <div className="mb-4 p-3 bg-gray-700 rounded text-sm text-gray-300">
                  <h4 className="font-semibold mb-2">Follow these steps:</h4>
                  <ol className="list-decimal pl-5 space-y-1">
                    {privateTransactionData.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                  <div className="mt-3">
                    <p className="mb-1"><span className="font-semibold">Deposit Address:</span> {privateTransactionData.depositAddress}</p>
                    <p><span className="font-semibold">Note:</span> {privateTransactionData.note}</p>
                    <p className="text-xs mt-2 text-yellow-400">Save this note! You'll need it to claim your funds.</p>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Processing...' : 'Fund Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FundButton; 