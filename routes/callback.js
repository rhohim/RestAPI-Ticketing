const express = require('express');
const bodyParser = require('body-parser');
const callbackController = require('../controllers/callbackController');

const router = express.Router();

router.use(bodyParser.json());

router.route('/')
    .post(callbackController.handlePaymentCallback)

router.route('/:id')
    .get(callbackController.getPaymentLogByReferenceId)

// router.post('/xendit-payment-callback', controller.handlePaymentCallback);

module.exports = router;