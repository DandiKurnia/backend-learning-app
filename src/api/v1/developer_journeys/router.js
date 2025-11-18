const express = require('express')

const { index, create, find, update, destroy } = require('./controller')
const router = express();

router.get('/journeys', index);
router.post('/journeys', create);
router.get('/journeys/:id', find);  
router.put('/journeys/:id', update);
router.delete('/journeys/:id', destroy);


module.exports = router;