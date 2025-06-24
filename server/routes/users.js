const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Assuming this exists and sets req.user.userId
const User = require('../models/User'); // Assuming you have a User model

// GET /api/v1/users/me - Get current authenticated user's profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // req.user.userId is set by the authMiddleware
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password from the response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/v1/users/me - Update current authenticated user's profile
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name } = req.body;

    const updateData = {};
    if (name) updateData.name = name;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
