import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const OtpVerification = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1 for email input, 2 for OTP input
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            return toast.error('Please enter your email address.');
        }
        setLoading(true);
        try {
            await axios.post('/api/v1/send-otp', { email });
            toast.success('OTP has been sent to your email!');
            setStep(2);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send OTP.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) {
            return toast.error('Please enter the OTP.');
        }
        setLoading(true);
        try {
            await axios.post('/api/v1/verify-otp', { email, otp });
            toast.success('Email verified successfully!');
            // You can now redirect or update the UI
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Invalid OTP.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Email Verification</h2>
                {step === 1 && (
                    <form onSubmit={handleSendOtp}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <p className="text-center text-gray-600 mb-4">
                            An OTP has been sent to <strong>{email}</strong>.
                        </p>
                        <div className="mb-4">
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                One-Time Password (OTP)
                            </label>
                            <input
                                type="text"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter 6-digit OTP"
                                maxLength="6"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                        >
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default OtpVerification;