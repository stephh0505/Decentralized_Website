import React from 'react';
import dynamic from 'next/dynamic';
import Header from '../components/Header';
import { ToastContainer } from 'react-toastify';
import ChatInterface from '../components/ChatInterface';

// Dynamically import the AccountPage component to avoid SSR issues with Chart.js
const AccountPage = dynamic(() => import('../components/AccountPage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
        <div className="space-y-6">
          <div className="h-40 bg-gray-800 rounded"></div>
          <div className="h-40 bg-gray-800 rounded"></div>
          <div className="h-96 bg-gray-800 rounded"></div>
        </div>
      </div>
    </div>
  ),
});

const Account = () => {
  return (
    <>
      <Header />
      <main>
        <AccountPage />
      </main>
      <ToastContainer />
      <ChatInterface />
    </>
  );
};

export default Account; 