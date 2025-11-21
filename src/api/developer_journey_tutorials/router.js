const express = require('express')

const { index, create, show, update, destroy } = require('./controller')
const router = express();

router.get('/tutorials', index)
router.post('/tutorials', create)


module.exports = router;
