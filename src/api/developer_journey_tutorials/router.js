const express = require('express')
const auth = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const { createTutorialSchema, updateTutorialSchema } = require('../../validations/developer_journey_tutorial')


const { index, find, create, update, destroy } = require('./controller')
const router = express.Router();

router.get('/journeys/:developerJourneyId/tutorials', auth, index)
router.get('/journeys/:developerJourneyId/tutorials/:tutorialId', auth, find)
router.post('/journeys/:developerJourneyId/tutorials', auth, validate(createTutorialSchema), create)
router.put('/journeys/:developerJourneyId/tutorials/:tutorialId', auth, validate(updateTutorialSchema), update)
router.delete('/journeys/:developerJourneyId/tutorials/:tutorialId', auth, destroy)

module.exports = router;