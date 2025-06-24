import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP & new password
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setError('');
        if (!email) {
            return setError('Please enter your email address.');
        }
        setLoading(true);
        try {
            // This endpoint will check if the email exists and send an OTP
            const res = await axios.post('/api/v1/request-password-reset', { email });
            toast.success(res.data.message); // "If your email is registered, an OTP has been sent."
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
        if (newPassword.length < 6) { // Example: minimum password length
            return setError('Password must be at least 6 characters long.');
        }

        setLoading(true);
        try {
            // First, verify OTP (this will mark it as verified in backend)
            const verifyRes = await axios.post('/api/v1/verify-otp', { email, otp });
            if (verifyRes.data.success) {
                // Then, reset password
                const resetRes = await axios.post('/api/v1/reset-password', { email, otp, newPassword });
                if (resetRes.data.success) {
                    toast.success('Password has been reset successfully! Please log in.');
                    navigate('/login'); // Redirect to login page
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
        <div className="min-h-screen flex items-center justify-center bg-white text-black">
            <motion.div
                className="p-8 max-w-md w-full bg-white rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                whileHover={{ scale: 1.025, boxShadow: '0 10px 24px rgba(0,0,0,0.08)' }}
            >
                <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center text-sm mb-4">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleRequestReset} className="flex flex-col gap-4">
                        <p className="text-sm text-gray-600 text-center">Enter your email to receive a password reset OTP.</p>
                        <input
                            type="email"
                            placeholder="Email"
                            className="p-2 border border-gray-300 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors hover:font-extrabold focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 active:bg-gray-900"
                        >
                            {loading ? <LoadingSpinner /> : 'Request Reset'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                        <p className="text-sm text-gray-600 text-center">
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
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors hover:font-extrabold focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 active:bg-gray-900"
                        >
                            {loading ? <LoadingSpinner /> : 'Reset Password'}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;