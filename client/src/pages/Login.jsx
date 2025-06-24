import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner"; // Import the spinner
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Add error state
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Set loading to true before API call
    try {
      const res = await axios.post("/api/v1/login", { // Corrected to use relative path for Vite proxy
        email,
        password
      });
      console.log(res.data);
      if (res.data.success === true) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userName", res.data.user.name); // Store user's name
        // Dispatch a custom event to notify other components like the Navbar
        toast.success("Login successful!");
        window.dispatchEvent(new Event("auth-change"));
        navigate("/login/home");
      } else {
        // If backend explicitly sends success: false or success is missing/falsy
        setError(res.data.message || "Login failed. Please check your credentials.");
        toast.error(res.data.message || "Login failed.");
      }
    } catch (error) {
      // console.error("Login error details:", error); // Removed debugging line
      // Set a user-friendly error message
      if (error.response && error.response.data && error.response.data.message) {
        // Use the error message from the backend if available
        setError(error.response.data.message);
      } else {
        // Generic fallback message
        setError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setLoading(false); // Set loading to false after API call (success or error)
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
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <form className="flex flex-col gap-4" autoComplete="off" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center text-sm">
              {error}
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            className="p-2 border border-gray-300 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
            value={email}
            name="no-autofill-email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 border border-gray-300 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
            value={password}
            name="no-autofill-password"
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors hover:font-extrabold focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 active:bg-gray-900 flex justify-center items-center h-10" disabled={loading}>
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          <Link
            to="/forgot-password"
            className="text-black hover:font-extrabold transition-all focus:outline-none"
          >
            Forgot password?
          </Link>
        </p>

        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-black hover:font-extrabold transition-all focus:outline-none"
          >
            Sign up here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}