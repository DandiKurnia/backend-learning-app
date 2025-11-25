const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { developerJourneyCompletionsSchema } = require("../../validations/developer_journey_completions");


const router = express.Router();

const { create } = require("./controller");

router.post(
    "/journeys/:journeyId/study-duration",
    validate(developerJourneyCompletionsSchema),
    auth,
    create
)

module.exports = router;
