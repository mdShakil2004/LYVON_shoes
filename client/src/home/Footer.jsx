// components/Footer.jsx
import React from 'react';

const Footer = ({ isDarkMode }) => {
  return (
    <footer className={`py-12 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-800 text-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">LyVON</h3>
            <p className="text-sm">Premium footwear for every step.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-indigo-400">About</a></li>
              <li><a href="/contact" className="hover:text-indigo-400">Contact</a></li>
              <li><a href="/privacy" className="hover:text-indigo-400">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-2xl"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-2xl"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-sm">Email: support@LyVON.com</p>
            <p className="text-sm">Phone: +91 123 456 7890</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm">&copy; 2025 LyVON. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;