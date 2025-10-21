// components/Newsletter.jsx
import React, { useState } from 'react';

const Newsletter = ({ isDarkMode }) => {
  const [email, setEmail] = useState('');
  return (
    <section className={`py-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Join Our Newsletter
        </h2>
        <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Stay updated with the latest collections and exclusive offers.
        </p>
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`p-3 rounded-l-lg border-2 w-64 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          />
          <button
            className="bg-indigo-600 text-white px-6 py-3 rounded-r-lg hover:bg-indigo-700 transition-colors !rounded-button"
            onClick={() => alert('Subscribed!')}
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;