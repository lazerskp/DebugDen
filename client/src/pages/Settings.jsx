import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Settings() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Button, 2: OTP & new password form
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch user's email when component mounts
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('You are not logged in.');
          navigate('/login');
          return;
        }
        const response = await axios.get('/api/v1/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmail(response.data.user.email);
      } catch (err) {
        setError('Failed to load user data.');
        toast.error('Failed to load user data.');
      }
    };
    fetchUserEmail();
  }, [navigate]);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/v1/request-password-reset', { email });
      toast.success(res.data.message);
      setStep(2);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to request password reset.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp || !newPassword || !confirmNewPassword) {
      return setError('All fields are required.');
    }
    if (newPassword !== confirmNewPassword) {
      return setError('Passwords do not match.');
    }
    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    setLoading(true);
    try {
      const verifyRes = await axios.post('/api/v1/verify-otp', { email, otp });
      if (verifyRes.data.success) {
        const resetRes = await axios.post('/api/v1/reset-password', { email, otp, newPassword });
        if (resetRes.data.success) {
          toast.success('Password has been reset successfully! Please log in again.');
          // Log the user out for security and navigate to login
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          window.dispatchEvent(new Event('auth-change'));
          navigate('/login');
        } else {
          setError(resetRes.data.message || 'Failed to reset password.');
        }
      } else {
        setError(verifyRes.data.message || 'OTP verification failed.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred during password reset.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        Settings
      </h1>
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Change Password</h3>
          {step === 1 && (
            <>
              <p className="text-gray-700">
                Click the button below to send a OTP reset Password to your registered email: <strong>{email}</strong>
              </p>
              <button
                onClick={handleRequestReset}
                disabled={loading || !email}
                className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium disabled:bg-gray-400"
              >
                {loading ? 'Sending...' : 'Send OTP Reset password'}
              </button>
            </>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <p className="text-sm text-gray-600">
                An OTP has been sent to <strong>{email}</strong>. Enter it below with your new password.
              </p>
              <input
                type="text"
                placeholder="One-Time Password (OTP)"
                className="p-2 border border-gray-300 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                className="p-2 border border-gray-300 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="p-2 border border-gray-300 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
              {error && (
                <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center text-sm">
                  {error}
                </div>
              )}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(''); }}
                  className="bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}
        </div>
        {/* You can add other settings sections here in the future */}
      </div>
    </div>
  );
}
