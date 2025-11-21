const express = require('express');
const auth = require('../../middlewares/auth');

const { index, create, find, update } = require('./controller');
const router = express.Router();

// Endpoint yang tidak memerlukan autentikasi
router.get('/journeys', index);

// Endpoint yang memerlukan autentikasi
router.post('/journeys', auth, create);
router.get('/journeys/:id', auth, find);
router.put('/journeys/:id', auth, update);

module.exports = router;