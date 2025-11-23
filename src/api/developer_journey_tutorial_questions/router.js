const express = require('express')
const auth = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const { createTutorialQuestionSchema, updateTutorialQuestionSchema } = require('../../validations/developer_journey_tutorial_questions')

const {index,create, find, update, destroy} = require('./controller')
const router = express.Router();

router.get('/tutorials/:tutorialId/questions', auth, index)
router.post('/tutorials/:tutorialId/questions', auth, validate(createTutorialQuestionSchema), create)
router.get('/tutorials/:tutorialId/questions/:questionId', auth, find)
router.put('/tutorials/:tutorialId/questions/:questionId', auth, validate(updateTutorialQuestionSchema), update)
router.delete('/tutorials/:tutorialId/questions/:questionId', auth, destroy)

module.exports = router;