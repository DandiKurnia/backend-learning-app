const express = require("express");
const auth = require("../../middlewares/auth");
const router = express.Router();

const {
    index,
    register,
    submitBulkAnswers,
    finishExam
} = require("./controller");

router.get("/tutorials/:tutorialId/exams", auth, index);
router.post("/tutorials/:tutorialId/exams/register", auth, register);

router.post("/exams/:examId/answers/bulk", auth, submitBulkAnswers);

router.post("/exams/:examId/finish", auth, finishExam);

module.exports = router;
