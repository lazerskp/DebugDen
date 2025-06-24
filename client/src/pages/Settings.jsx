import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 relative">
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-gray-600 transition-all focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
          ⚙️ Settings
        </h2>

        <div className="space-y-6">
          {/* Account Settings Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Settings</h3>
            <p className="text-gray-700">Manage your personal information, password, and email preferences.</p>
            <button className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
              Go to Account
            </button>
          </div>

          {/* Notification Settings Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Notification Preferences</h3>
            <p className="text-gray-700">Control how you receive updates and alerts from DebugDen.</p>
            <button className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
              Manage Notifications
            </button>
          </div>

          {/* Privacy Settings Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Privacy Settings</h3>
            <p className="text-gray-700">Adjust your privacy controls and data sharing options.</p>
            <button className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
              Review Privacy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
