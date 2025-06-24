import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (isEditing) return; // Don't refetch when in edit mode
    try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:3000/api/v1/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data.user);
        setFormData(response.data.user);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError(err.response?.data?.message || 'Failed to load profile data.');
        toast.error(err.response?.data?.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
  }, [isEditing]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:3000/api/v1/users/me', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfileData(res.data.user);
      localStorage.setItem('userName', res.data.user.name);
      window.dispatchEvent(new Event('auth-change')); // Notify header to update name
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Profile data not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 relative">
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-gray-600 transition-all focus:outline-none z-10"
          aria-label="Close"
        >
          &times;
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">
          {isEditing ? 'Edit Profile' : 'User Profile'}
        </h1>

        {isEditing ? (
          <form onSubmit={handleSave}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-gray-500 mt-1">{profileData.email} (cannot be changed)</p>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition-colors">Cancel</button>
              <button type="submit" disabled={isSaving} className="bg-black text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Name:</p>
                <p className="text-gray-800 text-lg font-medium">{profileData.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email:</p>
                <p className="text-gray-800 text-lg font-medium">{profileData.email}</p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <button onClick={() => setIsEditing(true)} className="bg-black text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all hover:scale-105">
                Edit Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
