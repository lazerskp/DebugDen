import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error on new submission
    try {
      const res = await axios.post("http://localhost:3000/api/v1/register", {
        name,
        email,
        password,
      });
      toast.success("Signup successful! Please log in.");
      navigate("/login"); // Navigate to login page after successful signup
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Signup failed. Please try again later.");
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
          <input type="text" name="fakeusernameremembered" style={{ display: "none" }} />
          <input type="password" name="fakepasswordremembered" style={{ display: "none" }} />

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
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors hover:font-extrabold focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 active:bg-gray-900"
            type="submit"
          >
            Signup
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-black hover:font-extrabold transition-all focus:outline-none"
          >
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;