import React, { useState } from 'react';

const LoginModal = ({ isDarkMode, setShowLoginModal, handleLogin }) => {
  const [mode, setMode] = useState('login'); // 'login', 'signup', or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Function to clear user data from localStorage after 30 minutes
  const setUserDataWithExpiry = (userData) => {
    const expiryTime = Date.now() + 30 * 60 * 1000; // 30 minutes
    const data = { ...userData, timestamp: expiryTime };
    let users = JSON.parse(localStorage.getItem('userData') || '[]');
    users = users.filter(user => user.email !== data.email);
    users.push(data);
    localStorage.setItem('userData', JSON.stringify(users));
    
    setTimeout(() => {
      let currentUsers = JSON.parse(localStorage.getItem('userData') || '[]');
      currentUsers = currentUsers.filter(user => user.email !== data.email);
      localStorage.setItem('userData', JSON.stringify(currentUsers));
    }, 30 * 60 * 1000);
  };

  // Handle regular login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    const users = JSON.parse(localStorage.getItem('userData') || '[]');
    const user = users.find(
      u => u.email === email && u.password === password && u.timestamp > Date.now()
    );
    if (!user) {
      setError('Invalid email or password, or session expired');
      return;
    }
    setError('');
    handleLogin(email, password);
    setShowLoginModal(false);
  };

  // Handle admin login
 const handleAdminSubmit = (e) => {
  e.preventDefault();
  if (!email || !password) {
    setError('Please enter both email and password');
    return;
  }

  const newAdminData = { email, password };
 
  localStorage.setItem('adminData', JSON.stringify(newAdminData));

  // Optional: store an expiry for admin session (e.g. 1 hour)
  const expiryTime = Date.now() + 60 * 60 * 1000; 
  localStorage.setItem('adminSessionExpiry', expiryTime);

  setShowLoginModal(false);
  window.location.href = '/admin';
};


  // Handle signup
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    const users = JSON.parse(localStorage.getItem('userData') || '[]');
    if (users.some(u => u.email === email && u.timestamp > Date.now())) {
      setError('Email already registered');
      return;
    }
    const role = 'user';
    setUserDataWithExpiry({ email, password, role });
    setError('');
    handleLogin(email, password);
    setShowLoginModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-[90vw] sm:max-w-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">{mode === 'admin' ? 'Admin Login ( temp use your email )' : mode === 'signup' ? 'Sign Up' : 'Login'}</h2>
          <button
            onClick={() => setShowLoginModal(false)}
            className={`text-gray-500 hover:text-gray-700 ${isDarkMode ? 'dark:hover:text-gray-300' : ''}`}
            aria-label="Close modal"
          >
            <i className="fas fa-times text-lg sm:text-xl"></i>
          </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-center mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => {
              setMode('login');
              setError('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base ${mode === 'login' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-900'} hover:bg-indigo-500 hover:text-white transition-colors`}
            aria-label="Switch to Login mode"
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base ${mode === 'signup' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-900'} hover:bg-indigo-500 hover:text-white transition-colors`}
            aria-label="Switch to Sign Up mode"
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setMode('admin');
              setError('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base ${mode === 'admin' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-900'} hover:bg-indigo-500 hover:text-white transition-colors`}
            aria-label="Switch to Admin mode"
          >
            Admin
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 rounded border text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 rounded border text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
              </button>
            </div>
          </div>
          {mode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-3 rounded border text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                </button>
              </div>
            </div>
          )}
          <button
            onClick={mode === 'admin' ? handleAdminSubmit : mode === 'signup' ? handleSignupSubmit : handleLoginSubmit}
            className={`w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 text-sm sm:text-base transition-colors ${isDarkMode ? 'hover:bg-indigo-500' : ''} !rounded-button`}
          >
            {mode === 'admin' ? 'Admin Login' : mode === 'signup' ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;