const Answer = require('../models/Answer');

/**
 * Toggles a like on an answer for the authenticated user.
 */
exports.toggleLikeOnAnswer = async (req, res) => {
  const { answerId } = req.params;
  const userId = req.user.userId; // From authMiddleware

  if (!userId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found.' });
    }

    const likeIndex = answer.likes.indexOf(userId);

    if (likeIndex > -1) {
      // User has already liked, so unlike
      answer.likes.splice(likeIndex, 1);
    } else {
      // User has not liked, so like
      answer.likes.push(userId);
    }

    await answer.save();
    await answer.populate('author', 'name'); // Repopulate author for the response
    res.status(200).json({ message: 'Like status updated.', answer });
  } catch (error) {
    console.error('Error toggling like on answer:', error);
    res.status(500).json({ message: 'Server error while updating like status.' });
  }
};
