import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-bold gradient-text tracking-tight">
              GhostFund
            </Link>
            <nav className="ml-12">
              <ul className="flex items-center space-x-8">
                <li>
                  <Link 
                    href="/projects/create" 
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-base hover:bg-gray-800 transition-all duration-300 ${
                      router.pathname === '/projects/create' ? 'gradient-text' : 'hover:gradient-text'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create Project</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/account" 
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-base hover:bg-gray-800 transition-all duration-300 ${
                      router.pathname === '/account' ? 'gradient-text' : 'hover:gradient-text'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Account</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/projects" 
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-base hover:bg-gray-800 transition-all duration-300 ${
                      router.pathname === '/projects' ? 'gradient-text' : 'hover:gradient-text'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>Projects</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/explore" 
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-base hover:bg-gray-800 transition-all duration-300 ${
                      router.pathname === '/explore' ? 'gradient-text' : 'hover:gradient-text'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Explore</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <button className="gradient-bg text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Connect Wallet</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 