const express = require('express')
const router = express.Router()
const participanController = require('../controllers/participanController')

router.route('/')
    .get(participanController.getAllParticipan)
    .post(participanController.postParticipan)
    .delete(participanController.deleteParticipan)
    
router.route('/all')
    .get(participanController.getAllParticipanRelation)

router.route('/all/:id')
    .get(participanController.getAllParticipanRelationbyID)   
    
router.route('/checkin/:id')
    .put(participanController.checkinTicket)    

router.route('/:id')
    .get(participanController.getParticipanbyID)
    .put(participanController.putParticipan)
    .delete(participanController.deleteParticipanbyID)



module.exports = router