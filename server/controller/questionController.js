const Question = require('../models/Question');

const askQuestion = async (req, res) => {
  try {
    // Destructure all fields from the request body, including the new imageUrl
    const { title, description, tags, imageUrl } = req.body;

    // Basic validation
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const newQuestion = new Question({
      title,
      description,
      tags,
      imageUrl, // Save the imageUrl to the database
      author: req.user.userId, // Assumes authMiddleware sets req.user.userId
    });

    await newQuestion.save();
    res.status(201).json({ message: 'Question posted successfully', question: newQuestion });
  } catch (error) {
    console.error('Error in askQuestion controller:', error);
    res.status(500).json({ message: 'Server error while posting question' });
  }
};

module.exports = {
  askQuestion,
};