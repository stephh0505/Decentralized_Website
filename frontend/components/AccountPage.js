import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AccountPage = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [projects, setProjects] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for the earnings chart
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Earnings',
        data: [0, 100, 300, 600, 1000, 1500],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white'
        }
      },
      title: {
        display: true,
        text: 'Monthly Earnings',
        color: 'white'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white',
          callback: function(value) {
            return '$' + value;
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'white'
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // This would normally fetch from your backend
        // Simulating API call with setTimeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setProjects([
          { id: 1, name: 'Project Alpha', ownership: 25, monthlyRevenue: 500 },
          { id: 2, name: 'Project Beta', ownership: 50, monthlyRevenue: 1000 },
          { id: 3, name: 'Project Gamma', ownership: 15, monthlyRevenue: 300 }
        ]);
        
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWalletUpdate = async (e) => {
    e.preventDefault();
    try {
      // Here you would normally make an API call to update the wallet info
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      console.log('Updating wallet:', { walletAddress, privateKey });
      // Show success message
      alert('Wallet information updated successfully!');
    } catch (err) {
      setError('Failed to update wallet information. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <h2 className="text-xl font-bold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Account Settings</h1>
      
      {/* Wallet Settings */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">Wallet Settings</h2>
        <form onSubmit={handleWalletUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              MetaMask Wallet Address
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your wallet address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Private Key
            </label>
            <div className="relative">
              <input
                type={showPrivateKey ? "text" : "password"}
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your private key"
              />
              <button
                type="button"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="absolute right-2 top-2 text-gray-400 hover:text-white"
              >
                {showPrivateKey ? "Hide" : "Show"}
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-400">Never share your private key with anyone</p>
          </div>
          
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
          >
            Update Wallet Information
          </button>
        </form>
      </div>

      {/* Projects Owned */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">Projects Owned</h2>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-gray-700 rounded-lg p-4">
                <div className="h-6 bg-gray-600 rounded w-1/3"></div>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                    <div className="mt-1 h-6 bg-gray-600 rounded w-1/4"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                    <div className="mt-1 h-6 bg-gray-600 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map(project => (
              <div key={project.id} className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-xl font-medium text-white">{project.name}</h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Ownership</p>
                    <p className="text-white font-semibold">{project.ownership}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Monthly Revenue</p>
                    <p className="text-white font-semibold">${project.monthlyRevenue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Earnings Chart */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">Earnings Overview</h2>
        <div className="h-[400px] w-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 