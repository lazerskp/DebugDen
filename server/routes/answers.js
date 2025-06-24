const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { toggleLikeOnAnswer } = require("../controller/answerController"); // Corrected path

// Route to like/unlike an answer
router.put('/:answerId/like', authMiddleware, toggleLikeOnAnswer);

module.exports = router;
