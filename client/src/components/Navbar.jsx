import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center h-16">
          {/* Left-side logo (non-clickable) */}
          <div className="flex items-center justify-start">
            <span className="text-2xl font-bold text-black">DebugDen</span>
          </div>

          {/* Center navigation links */}
          <div className="flex items-center justify-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-black transition-colors text-sm font-medium">
              DebugDen
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-black transition-colors text-sm font-medium">
              About Us
            </Link>
          </div>

          {/* Right-side button */}
          <div className="flex items-center justify-end">
            <Link
              to="/login"
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}