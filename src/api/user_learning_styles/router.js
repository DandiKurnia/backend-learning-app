const express = require("express");
const auth = require("../../middlewares/auth");
const {
    processManual,
    getMyLearningStyle,
    getMyLatestLearningStyle,
    getUserLearningStyle,
    getAllLearningStyles,
    getLatestUserLearningStyle
} = require("./controller");

const router = express.Router();

// Manual trigger endpoint for processing learning styles
// POST /api/process-learning-style
router.post("/process-learning-style", auth, processManual);

// Get learning style for the authenticated user
// GET /api/my-learning-style
router.get("/my-learning-style", auth, getMyLearningStyle);

// Get the latest learning style for the authenticated user
// GET /api/my-latest-learning-style
router.get("/my-latest-learning-style", auth, getMyLatestLearningStyle);

// Get learning style for a specific user (admin only)
// GET /api/user-learning-style/:userId
router.get("/user-learning-style/:userId", auth, getUserLearningStyle);

// Get all learning styles for a specific period (admin only)
// GET /api/user-learning-styles
router.get("/user-learning-styles", auth, getAllLearningStyles);

// Get the latest learning style for a specific user (admin only)
// GET /api/user-learning-style/latest/:userId
router.get("/user-learning-style/latest/:userId", auth, getLatestUserLearningStyle);

module.exports = router;