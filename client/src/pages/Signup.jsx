import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner"; // Import the spinner
import toast from "react-hot-toast";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Signup form, 2: OTP verification
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error on new submission
    if (step === 1) {
      setLoading(true); // Set loading for OTP send
      try {
        // Step 1: Send OTP
        await axios.post("/api/v1/send-otp", { email });
        toast.success("OTP sent to your email. Please verify.");
        setStep(2);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to send OTP.";
        setError(errorMessage);
      } finally {
        setLoading(false); // Reset loading
      }
    } else if (step === 2) {
      setLoading(true); // Set loading for OTP verify/register
      // Step 2: Verify OTP and then attempt registration
      try {
        const verificationResult = await axios.post("/api/v1/verify-otp", { email, otp });
        if (verificationResult.data.success) {
          try {
            // Proceed with registration only after successful OTP verification
            const res = await axios.post("/api/v1/register", {
              name,
              email,
              password,
            });
            if (res.data.success) {
              toast.success("Signup successful! Please log in.");
              navigate("/login"); // Navigate to login page after successful signup
            } else {
              // This block might be hit if backend sends success: false with 200 status
              setError(res.data.message || "Registration failed after OTP verification.");
            }
          } catch (registerError) {
            // Handle registration errors (e.g., user already exists, server error)
            if (registerError.response && registerError.response.status === 409) {
              toast.error(registerError.response.data.message || "User already registered. Please log in.");
              navigate("/login"); // Redirect to login page
            } else {
              const regErrorMessage = registerError.response?.data?.message || "Registration failed.";
              setError(regErrorMessage);
            }
          }
        } else {
          setError(verificationResult.data.message || "Invalid OTP.");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || "OTP verification failed.";
        setError(errorMessage);
      } finally {
        setLoading(false); // Reset loading
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <motion.div
        className="p-8 max-w-md w-full bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        whileHover={{ scale: 1.025, boxShadow: "0 10px 24px rgba(0,0,0,0.08)" }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Signup</h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center text-sm">
              {error}
            </div>
          )}
          {step === 1 ? (
            <React.Fragment key="signup-form">

              <input
                type="text"
                placeholder="Username"
                className="p-2 border border-gray-300 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
                value={name}
                onChange={(e) => setName(e.target.value)}
                name="signup-name"
                autoComplete="off"
              />
              <input
                type="email"
                placeholder="Email"
                className="p-2 border border-gray-300 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="signup-email"
                autoComplete="off"
              />
              <input
                type="password"
                placeholder="Password"
                className="p-2 border border-gray-300 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="signup-password"
                autoComplete="new-password"
              />
              <button
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors hover:font-extrabold focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 active:bg-gray-900 flex justify-center items-center h-10"
                type="submit"
                disabled={loading}
              >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : "Signup"}
              </button>
            </React.Fragment>
          ) : (
            <React.Fragment key="otp-verification">
              <p className="text-center text-gray-600 mb-4">
                An OTP has been sent to <strong>{email}</strong>.
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                className="p-2 border border-gray-300 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                name="otp"
                autoComplete="off"
              />
              <button
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors hover:font-extrabold focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 active:bg-gray-900 flex justify-center items-center h-10"
                type="submit"
                disabled={loading}
              >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : "Verify OTP and Signup"}
              </button>
            </React.Fragment>
          )}
        </form>
        {step === 1 && (
          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-black hover:font-extrabold transition-all focus:outline-none"
            >
              Login here
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default Signup;