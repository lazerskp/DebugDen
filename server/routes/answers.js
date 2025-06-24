const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Answer = require("../models/Answer");

module.exports = router;
