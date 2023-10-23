const express = require('express')
const router = express.Router()
const ticketController = require('../controllers/ticketController')


router.route('/')
    .get(ticketController.getAllTicket)
    .post(ticketController.postTicket)
    .delete(ticketController.deleteTicket)

router.route('/:id')
    .get(ticketController.getTicketbyID)
    .put(ticketController.putTicket)
    .delete(ticketController.deleteTicketbyID)
module.exports = router