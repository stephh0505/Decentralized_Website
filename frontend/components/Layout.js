/**
 * Layout Component
 * Provides consistent layout structure for all pages
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

/**
 * Layout component for consistent page structure
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description for SEO
 * @param {string} props.pageTitle - Title displayed in the header
 */
const Layout = ({ 
  children, 
  title = 'GhostFund', 
  description = 'Anonymous crowdfunding platform powered by blockchain technology',
  pageTitle
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      {/* Header */}
      <header className="bg-gray-800 py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                GhostFund
              </Link>
              {pageTitle && (
                <>
                  <span className="mx-3 text-gray-500">/</span>
                  <h1 className="text-xl font-semibold text-white">{pageTitle}</h1>
                </>
              )}
            </div>
            <nav className="flex space-x-4">
              <Link href="/projects" className="text-gray-300 hover:text-white transition-colors duration-200">
                Projects
              </Link>
              <Link href="/projects/new" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                Create Project
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 py-6 shadow-inner">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} GhostFund. All rights reserved.
          </p>
          <div className="flex justify-center mt-3 space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 