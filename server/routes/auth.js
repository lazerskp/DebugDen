const express = require("express");
const { Register, loginUser, sendOtp, verifyOtp, requestPasswordReset, resetPassword } = require("../controller/authController")
const Router = express.Router();

Router.post("/register",Register);
Router.post("/login",loginUser)

// Routes for OTP email verification
Router.post("/send-otp", sendOtp); // Used for signup verification
Router.post("/verify-otp", verifyOtp); // Used for signup verification

// Routes for Forgot Password flow
Router.post("/request-password-reset", requestPasswordReset);
Router.post("/reset-password", resetPassword);

module.exports = Router;