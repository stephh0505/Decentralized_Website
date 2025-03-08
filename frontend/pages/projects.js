/**
 * Projects Page
 * Displays a list of all projects
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  // State for projects and loading status
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await getProjects();
        if (response.success) {
          setProjects(response.projects || []);
        } else {
          setError(response.error || 'Failed to fetch projects');
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('An error occurred while fetching projects');
      } finally {
        setIsLoading(false);
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

  return (
    <Layout
      title="Browse Projects | GhostFund"
      description="Browse and fund anonymous projects on GhostFund"
      pageTitle="Browse Projects"
    >
      {/* Filters and Search */}
      <section className="py-6 bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* Filter dropdown */}
            <div className="w-full md:w-1/4">
              <label htmlFor="filter" className="block text-gray-400 mb-2">
                Filter by Status
              </label>
              <select
                id="filter"
                value={filter}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded py-2 px-3 focus:outline-none focus:border-green-500"
              >
                <option value="all">All Projects</option>
                <option value="active">Active</option>
                <option value="funded">Funded</option>
                <option value="draft">Draft</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            {/* Search input */}
            <div className="w-full md:w-3/4">
              <label htmlFor="search" className="block text-gray-400 mb-2">
                Search Projects
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by title or description..."
                className="w-full bg-gray-700 text-white border border-gray-600 rounded py-2 px-3 focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            // Loading state
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" text="Loading projects..." />
            </div>
          ) : error ? (
            // Error state
            <div className="max-w-2xl mx-auto">
              <ErrorMessage message={error} />
              <div className="text-center mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredProjects.length === 0 ? (
            // No projects found
            <EmptyState 
              message={
                filter !== 'all' || searchTerm 
                  ? "No projects found matching your criteria." 
                  : "No projects have been created yet."
              }
              icon={searchTerm ? 'search' : 'projects'}
              action={
                filter !== 'all' || searchTerm 
                  ? {
                      text: "Clear Filters",
                      onClick: () => {
                        setFilter('all');
                        setSearchTerm('');
                      }
                    }
                  : {
                      text: "Create the First Project",
                      href: "/projects/new"
                    }
              }
            />
          ) : (
            // Projects grid
            <>
              <p className="text-gray-400 mb-6">
                Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map(project => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
} 