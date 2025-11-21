const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate'); 
const { createJourneySchema,updateJourneySchema } = require('../../validations/developer_journey');

const { index, create, find, update } = require('./controller');
const router = express.Router();

// Endpoint tanpa auth
router.get('/journeys', index);

// Endpoint dengan auth + validasi
router.post('/journeys', auth, validate(createJourneySchema), create);

router.get('/journeys/:id', auth, find);
router.put('/journeys/:id', auth, validate(updateJourneySchema), update);

module.exports = router;
