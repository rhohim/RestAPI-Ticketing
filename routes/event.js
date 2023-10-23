const express = require('express')
const router = express.Router()
const eventController = require('../controllers/eventController')

router.route('/') 
    .get(eventController.getAllEvent)
    .post(eventController.postEvent)
    .delete(eventController.deleteEvent)

router.route('/:id')
    .get(eventController.getEventbyID)
    .put(eventController.putEvent)
    .delete(eventController.deleteEventbyID)


module.exports = router