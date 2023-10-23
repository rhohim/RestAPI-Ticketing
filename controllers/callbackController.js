const db = require('../models/connection')

const handlePaymentCallback = (req, res) => {
    // Process the payment callback data
    const paymentData = req.body.data; // Access the 'data' object within the request body

    const userAgent = req.headers['x-callback-token']
    console.log(userAgent)

    const {
        payment_detail: { receipt_id, source },
        reference_id,
        status
    } = paymentData;

    // // Print the extracted fields
    // console.log("Receipt ID:", receipt_id);
    // console.log("Source:", source);
    // console.log("Reference ID:", reference_id);
    // console.log("Status:", status);
    const paymentLog = {
        receipt_id,
        source,
        reference_id,
        status
    };
    const sql = 'INSERT INTO log_payment SET ?';
    db.query(sql, paymentLog, (error, result) => {
        if (error) {
            console.error("Error saving payment log:", error);
            res.status(500).json({
                message: "Error saving payment log",
                error: error
            });
        } else {
            res.status(200).json({ message: 'Payment callback received' });
        }
    });
    // Send a 200 response to acknowledge receipt of the callback
    // res.status(200).json({ message: 'Payment callback received' });
};

const getPaymentLogByReferenceId = (req, res) => {
    const referenceId = req.params.id;
    console.log(referenceId)

    const sql = 'SELECT * FROM log_payment WHERE reference_id = ?';
    db.query(sql, [referenceId], (error, results) => {

        if (error) {
            console.error("Error retrieving payment log:", error);
            res.status(500).json({
                message: "Error retrieving payment log",
                error: error
            });
        } else {
            if (results.length === 0) {
                // No payment log found for the given reference_id
                res.status(404).json({
                    message: "Failed payment",
                    error: "No payment log found for the provided reference_id"
                });
            } else {
                // Payment log found, return the payment data
                res.status(200).json({
                    id: results[0].id,
                    data: {
                        receipt_id: results[0].receipt_id,
                        source: results[0].source,
                        reference_id: results[0].reference_id,
                        status: results[0].status
                    }
                });
            }
        }

        // if (error) {
        //     console.error("Error retrieving payment log:", error);
        //     res.status(500).json({
        //         message: "Error retrieving payment log",
        //         error: error
        //     });
        // } else {
        //     console.log(results)
        //     res.status(200).json({
        //         id : results[0].id,
        //         data: {
        //             receipt_id : results[0].receipt_id,
        //             source : results[0].source,
        //             reference_id : results[0].reference_id,
        //             status : results[0].status
        //         }
        //     });
        // }
    });
};

module.exports = {
    handlePaymentCallback,
    getPaymentLogByReferenceId
}