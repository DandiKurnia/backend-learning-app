const express = require("express");
const auth = require("../../middlewares/auth");
const router = express.Router();

const {
  index,
  register,
  submitBulkAnswers,
  finishExam,
} = require("./controller");

// Get all exam registrations for a tutorial
router.get("/tutorials/:tutorialId/exams", auth, index);

// Register/start a new exam
router.post("/tutorials/:tutorialId/exams/register", auth, register);

// Submit bulk answers during exam
router.post("/exams/:examId/answers/bulk", auth, submitBulkAnswers);

// Finish exam and calculate results
router.post("/exams/:examId/finish", auth, finishExam);

module.exports = router;
