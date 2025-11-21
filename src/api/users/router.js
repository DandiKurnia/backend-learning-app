const express = require('express');

const { register, login, refresh, logout } = require('./controller');
const router = express.Router();
const validate = require('../../middlewares/validate'); 
const {registerUserSchema, loginUserSchema} = require('../../validations/user');

router.post('/auth/register', validate(registerUserSchema), register);
router.post('/auth/login', validate(loginUserSchema), login);
router.put('/auth/refresh',  refresh);
router.delete('/auth/logout', logout);


module.exports = router;