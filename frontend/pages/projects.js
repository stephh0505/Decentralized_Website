/**
 * Projects Page
 * Displays a list of all projects
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Layout from '../components/Layout';
import { getProjects } from '../utils/api';

/**
 * Projects component displays a list of all projects
 */
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
        
        if (response.data.success) {
          setProjects(response.data.projects);
        } else {
          throw new Error(response.data.error || 'Failed to fetch projects');
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on status and search term
  const filteredProjects = projects.filter(project => {
    // Filter by status
    if (filter !== 'all' && project.status !== filter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !project.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !project.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-lg">
              <div className="h-4 bg-gray-600 rounded w-1/4"></div>
              <div className="space-y-3 mt-4">
                <div className="h-4 bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-600 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
    <Layout
      title="Browse Projects | GhostFund"
      description="Browse and fund anonymous projects on GhostFund"
      pageTitle="Browse Projects"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Projects</h1>
          <Link
            href="/projects/new"
            className="gradient-bg text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            Create Project
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <h2 className="text-xl font-bold gradient-text mb-2">{project.name}</h2>
                <p className="text-gray-300 mb-4">{project.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Funding Goal</span>
                    <span className="text-white">${project.fundingGoal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current Funding</span>
                    <span className="text-white">${project.currentFunding.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Category</span>
                    <span className="gradient-text">{project.category}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/projects/${project.id}`}
                      className="gradient-text hover:opacity-80 text-sm font-medium flex items-center space-x-1"
                    >
                      <span>View Details</span>
                      <span className="text-lg">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
} 