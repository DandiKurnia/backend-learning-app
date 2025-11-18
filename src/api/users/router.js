const express = require('express');

const { register, login, refresh, logout } = require('./controller');
const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.put('/auth/refresh', refresh);
router.delete('/auth/logout', logout);


module.exports = router;