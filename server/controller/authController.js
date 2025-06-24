const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// In-memory store for OTPs. For production, use a database or cache like Redis.
const otpStore = new Map();

// Setup nodemailer transporter using credentials from .env
// Make sure EMAIL_USER and EMAIL_PASS are in your .env file
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use a Gmail App Password here
    },
});
  

  exports.Register = async (req, res) => {
    try {
       
     const {name,email,password} = req.body
        if (!name  || !email || !password) {
            return res.status(400).json({ // Changed from 300 to 400 Bad Request
                success: false,
                message: "Missing Required Fields"
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ // Use 409 Conflict for existing resource
                success: false,
                message: "User Already Registered to this Platform, Please try Login"
            })
        }

        // Check if OTP is verified before registering
        if (otpStore.has(email)) {
            const storedOtpData = otpStore.get(email);
            if (storedOtpData.verified) {
                const hassedPassword = await bcrypt.hash(password, 10);

                const user = new User({
                    name,
                    email,
                    password: hassedPassword,
                });

                await user.save();
                otpStore.delete(email); // Remove OTP after successful registration
                return res.status(201).json({ // Use 201 Created for successful resource creation
                    success: true,
                    message: "User Created Successfully",
                });
            }
        }
        return res.status(400).json({ success: false, message: "Email not verified. Please verify OTP first." });

    }
    catch (error) {
        console.error("Error during registration:", error.message); // Use console.error for errors
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred during registration."
        });
    }

}

/**
 * Handles a request to send a password reset OTP.
 * For security, it always returns a generic success message to prevent email enumeration.
 */
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    // Intentionally not awaiting the result of the async operations
    // to ensure a quick, consistent response time.
    User.findOne({ email }).then(user => {
        if (user) {
            // User exists, send the OTP. We don't need to wait for this.
            // Errors will be logged on the server but not exposed to the client.
            generateAndSendOtp(email).catch(err => console.error('Error sending password reset OTP:', err));
        }
    }).catch(err => console.error('Database error on find user for password reset:', err));

    // Always return a generic success message immediately.
    return res.status(200).json({ success: true, message: 'If your email is registered, you will receive an OTP.' });
};

/**
 * Handles a request to send an OTP for new user signup.
 */
exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    try {
        await generateAndSendOtp(email);
        res.status(200).json({ success: true, message: 'OTP sent successfully to your email.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again later.' });
    }
};

async function generateAndSendOtp(email) {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    otpStore.set(email, { otp, expires, verified: false }); // Ensure 'verified' is false initially

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Verification',
        text: `Your One-Time Password (OTP) is: ${otp}. It is valid for 10 minutes.`,
        html: `<p>Your One-Time Password (OTP) is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
}

exports.verifyOtp = (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const storedOtpData = otpStore.get(email);

    if (!storedOtpData) {
        return res.status(400).json({ success: false, message: 'Invalid OTP. Please request a new one.' });
    }

    if (storedOtpData.otp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    if (Date.now() > storedOtpData.expires) {
        otpStore.delete(email);
        return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    // Mark OTP as verified, but don't delete it yet. It will be deleted after successful registration.
    storedOtpData.verified = true;
    otpStore.set(email, storedOtpData);

    res.status(200).json({ success: true, message: 'Email verified successfully!' });
};

exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required.' });
    }

    const storedOtpData = otpStore.get(email);

    if (!storedOtpData || storedOtpData.otp !== otp || !storedOtpData.verified) {
        return res.status(400).json({ success: false, message: 'Invalid or unverified OTP.' });
    }

    if (Date.now() > storedOtpData.expires) {
        otpStore.delete(email);
        return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        otpStore.delete(email); // OTP used, delete it
        res.status(200).json({ success: true, message: 'Password reset successfully!' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ success: false, message: 'Failed to reset password. Please try again later.' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ // Changed from 300 to 400 Bad Request
                success: false,
                message: "Email and password are required."
            });
        }

        const existingUser = await User.findOne({ email }).select('+password');

        if (!existingUser) {
            // Use 401 for authentication errors to be generic and secure
            return res.status(401).json({
                success: false,
                message: "Invalid credentials. Please try again."
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials. Please try again."
            });
        }

        const token = jwt.sign({ userId: existingUser._id, role: existingUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).json({
            success: true,
            message: "User logged in successfully.",
            token: token,
            role: existingUser.role,
            user: { name: existingUser.name, email: existingUser.email } // Include user object with name
        });
    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({
            success: false,
            message: "An unexpected server error occurred during login."
        });
    }

}
