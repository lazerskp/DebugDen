const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { askQuestion } = require('../controller/questionController');
const Answer = require("../models/Answer"); // Import Answer model
const Question = require("../models/Question");

// Helper to get user's vote status for a question
const getUserVote = (question, userId) => {
  if (!userId) return 0; // Not authenticated, no vote
  // Ensure question.voters is an array before trying to find
  if (!Array.isArray(question.voters)) return 0;
  const voter = question.voters.find(v => v.userId && v.userId.toString() === userId.toString());
  return voter ? voter.vote : 0;
};

// GET all questions (now authenticated to show user's vote)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .populate("author", "name")
      .populate({ path: "comments", populate: { path: "author", select: "name" } }); // Populate comments and their authors

    const questionsWithVoteStatus = questions.map(q => {
      // Use .lean() in the query to get plain JS objects directly,
      // or ensure .toObject() is called on a valid Mongoose document.
      const questionObj = q.toObject ? q.toObject() : q; // Handle if q is already a plain object
      return {
        ...questionObj,
        commentCount: questionObj.comments ? questionObj.comments.length : 0, // Ensure commentCount is a number
        userVote: getUserVote(q, req.user.id) // Pass the original Mongoose doc to getUserVote
      };
    });

    res.json(questionsWithVoteStatus);
  } catch (err) {
    console.error("Backend error fetching questions:", err); // ADD THIS LINE
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("author", "name")
      .populate({ path: "comments", populate: { path: "author", select: "name" } }); // Populate comments and their authors

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (err) {
    console.error("Backend error fetching single question:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/v1/questions/:id/comments - Add a new comment (answer) to a question
router.post("/:id/comments", authMiddleware, async (req, res) => {
  try {
    const questionId = req.params.id;
    const { text } = req.body;
    const userId = req.user.userId; // Assuming authMiddleware sets req.user.userId

    const newAnswer = new Answer({
      text,
      author: userId,
      question: questionId,
    });
    await newAnswer.save();

    // Add the new answer's ID to the question's comments array
    await Question.findByIdAndUpdate(questionId, { $push: { comments: newAnswer._id } }, { new: true });

    await newAnswer.populate('author', 'name'); // Populate author for the response
    res.status(201).json({ message: "Comment added successfully", comment: newAnswer });
  } catch (err) {
    console.error("Backend error adding comment:", err);
    res.status(404).json({ message: "Question not found" });
  }
});

router.post('/ask', authMiddleware, askQuestion);

// PUT /api/v1/questions/:id/vote - Handle voting
router.put("/:id/vote", authMiddleware, async (req, res) => {
  try {
    const questionId = req.params.id;
    const { type } = req.body; // 'upvote' or 'downvote'
    const userId = req.user.userId;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    let oldUserVote = getUserVote(question, userId);
    let newUpvotes = question.upvotes;
    let newDownvotes = question.downvotes;
    let newUserVote = 0; // 0 for no vote, 1 for upvote, -1 for downvote

    // Remove existing vote if present
    question.voters = question.voters.filter(v =>
      // Ensure v.userId and userId are not null/undefined before calling toString()
      v.userId && userId && v.userId.toString() !== userId.toString()
    );

    if (oldUserVote === 1) {
      newUpvotes--;
    } else if (oldUserVote === -1) {
      newDownvotes--;
    }

    // Apply new vote
    if (type === 'upvote') {
      if (oldUserVote === 1) {
        // User clicked upvote again, so cancel the upvote
        newUserVote = 0;
      } else {
        // New upvote
        newUpvotes++;
        newUserVote = 1;
        question.voters.push({ userId, vote: 1 });
      }
    } else if (type === 'downvote') {
      if (oldUserVote === -1) {
        // User clicked downvote again, so cancel the downvote
        newUserVote = 0;
      } else {
        // New downvote
        newDownvotes++;
        newUserVote = -1;
        question.voters.push({ userId, vote: -1 });
      }
    } else {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    question.upvotes = newUpvotes;
    question.downvotes = newDownvotes;
    await question.save();

    // Fetch the updated question with populated fields for the response
    const updatedQuestion = await Question.findById(questionId)
      .populate("author", "name")
      .populate("comments");
    res.status(200).json({
      ...updatedQuestion.toObject(),
      commentCount: updatedQuestion.comments ? updatedQuestion.comments.length : 0,
      userVote: newUserVote // Send back the user's specific vote for this question
    });
  } catch (err) {
    console.error("Backend error handling vote:", err); // ADD THIS LINE
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
