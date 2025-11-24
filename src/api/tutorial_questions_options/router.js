const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const {
  createTutorialQuestionsOptionsSchema,
  updateTutorialQuestionsOptionsSchema,
} = require("../../validations/tutorial_questions_options");

const router = express.Router();

const { index, create, update, destroy } = require("./controller");

router.get("/questions/:questionId/options", auth, index);
router.post(
  "/questions/:questionId/options",
  auth,
  validate(createTutorialQuestionsOptionsSchema),
  create
);
router.put(
  "/questions/:questionId/options/:optionId",
  auth,
  validate(updateTutorialQuestionsOptionsSchema),
  update
);
router.delete("/questions/:questionId/options/:optionId", auth, destroy);

module.exports = router;
