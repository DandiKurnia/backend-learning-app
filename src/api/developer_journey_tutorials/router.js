const express = require('express')
const auth = require('../../middlewares/auth')

const { index, find, create, update, destroy } = require('./controller')
const router = express();

router.get('/journeys/:developerJourneyId/tutorials', auth, index)
router.get('/journeys/:developerJourneyId/tutorials/:tutorialId', auth, find)
router.post('/journeys/:developerJourneyId/tutorials', auth, create)
router.put('/journeys/:developerJourneyId/tutorials/:tutorialId', auth, update)
router.delete('/journeys/:developerJourneyId/tutorials/:tutorialId', auth, destroy)

module.exports = router;