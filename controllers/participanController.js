const db = require('../models/connection')

const getAllParticipan = (req, res) => {
    const sql = "SELECT * FROM participan" 
    db.query(sql, (error, result) => {
        if (error){
            res.status(500).json({
                message: "Error fetching participant",
                error: error
            });
        } else {
            if (result.length === 0) {
                res.status(404).json({
                    message: "Participant not found"
                });
        } else {
                const formattedData = result.map(data => ({
                    id: data.id,
                    data : {
                        name : data.name,
                        email : data.email,
                        whatsapp : data.whatsapp,
                        type_ticket : data.type_ticket,
                        qty : data.qty,
                        id_pesanan : data.id_pesanan,
                        qr_code: data.qr_code,
                        ispaid : data.ispaid,
                        status : data.status,
                        clock_in : data.clock_in
                    }
                }))
                // console.log(formattedData)
                res.json({
                    "data" : formattedData,
                    "message" : "success"
                })
        }
        }      
    })
}
 
const postParticipan = (req, res) => {
    console.log(req.body.id_event)
    const { name, email, whatsapp, id_event, type_ticket, qty, id_pesanan, qr_code, ispaid } = req.body;
    const sql = 'INSERT INTO participan (name, email, whatsapp, id_event, type_ticket, qty, id_pesanan, qr_code, ispaid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    const values = [name, email, whatsapp, id_event, type_ticket, qty, id_pesanan, qr_code, ispaid]

    db.query(sql, values, (error, result) =>{
        if (error) {
            // console.error("Error inserting participant:", error);
            res.status(500).json({
                message: "Error inserting participant",
                error: error
            });
        } else {
            res.json({
                message: "Success",
                participantId: result.insertId
            });
        }
    })
}

const deleteParticipan = (req, res) => {
    const sql = 'DELETE FROM participan';

    db.query(sql, (error, result) => {
        if (error) {
            console.error("Error deleting participants:", error);
            res.status(500).json({
                message: "Error deleting participants",
                error: error
            });
        } else {
            res.json({
                message: "deleted"
            });
        }
    });
}

const putParticipan = (req, res) => {
    const participantId = req.params.id;
    const { name, email, whatsapp, id_event, type_ticket, qty, id_pesanan, qr_code, ispaid } = req.body;

    const sql = 'UPDATE participan SET name = ?, email= ?, whatsapp= ?, id_event= ?, type_ticket= ?, qty= ?, id_pesanan= ?, qr_code= ?, ispaid= ? WHERE id = ?';
    const values = [name, email, whatsapp, id_event, type_ticket, qty, id_pesanan, qr_code, ispaid, participantId];

    db.query(sql, values, (error, result) => {
        if (error) {
            console.error("Error updating participant:", error);
            res.status(500).json({
                message: "Error updating participant",
                error: error
            });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({
                    message: "Participant not found"
                });
            } else {
                res.json({
                    message: "Updated"
                });
            }
        }
    });
}

const getParticipanbyID = (req, res) => {
    const participantId = req.params.id;
    const sql = "SELECT * FROM participan WHERE id = ?";
    db.query(sql, [participantId], (error, result) => {
        if (error) {
            console.error("Error fetching participant:", error);
            res.status(500).json({
                message: "Error fetching participant",
                error: error
            });
        } else {
            if (result.length === 0) {
                res.status(404).json({
                    message: "Participant not found"
                });
            } else {
                res.json({
                    id : result[0].id,
                    data: {
                        name : result[0].name,
                        email : result[0].email,
                        whatsapp : result[0].whatsapp,
                        type_ticket : result[0].type_ticket,
                        qty : result[0].qty,
                        id_pesanan : result[0].id_pesanan,
                        qr_code: result[0].qr_code,
                        ispaid : result[0].ispaid,
                        status : result[0].status,
                        clock_in : result[0].clock_in

                    },
                    message: "Success"
                });
            }
        }
    })
}

const deleteParticipanbyID = (req, res) => {
    const participantId = req.params.id;

    const sql = 'DELETE FROM participan WHERE id = ?';

    db.query(sql, [participantId], (error, result) => {
        if (error) {
            console.error("Error deleting participant:", error);
            res.status(500).json({
                message: "Error deleting participant",
                error: error
            });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({
                    message: "Participant not found"
                });
            } else {
                res.json({
                    message: "deleted"
                });
            }
        }
    });
}

const getAllParticipanRelation = (req, res) => {
    const sql = `
    SELECT p.*, e.name AS event_name, t.ticket_code
    FROM participan p
    JOIN event e ON p.id_event = e.id
    JOIN ticket t ON p.id_ticket = t.id`;

    db.query(sql, (error, result) => {
        if (error) {
            console.error("Error fetching participants:", error);
            res.status(500).json({
                message: "Error fetching participants",
                error: error
            });
        } else {
            const formattedData = result.map(data => ({
                id: data.id,
                data: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    event_name: data.event_name,
                    ticket_code: data.ticket_code
                }
            }));
            
            res.json({
                data: formattedData,
                message: "Success"
            });
        }
    });
}

const getAllParticipanRelationbyID = (req,res) => {
    // console.log("realtion id")
    const participantId = req.params.id; // Assuming you get the participant ID from the request parameters

    const sql = `
    SELECT p.*, e.name AS event_name, t.ticket_code
    FROM participan p
    JOIN event e ON p.id_event = e.id
    JOIN ticket t ON p.id_ticket = t.id
    WHERE p.id = ?`;

    db.query(sql, [participantId], (error, result) => {
    if (error) {
        console.error("Error fetching participant:", error);
        res.status(500).json({
            message: "Error fetching participant",
            error: error
        });
    } else {
        if (result.length === 0) {
            res.status(404).json({
                message: "Participant not found"
            });
        } else {
            const formattedData = {
                id: result[0].id,
                data: {
                    name: result[0].name,
                    email: result[0].email,
                    phone: result[0].phone,
                    event_name: result[0].event_name,
                    ticket_code: result[0].ticket_code
                }
            };

            res.json({
                data: formattedData,
                message: "Success"
            });
        }
    }
    });
}

const checkinTicket = (req, res) => {
    const id_pesanan = req.params.id; // Assuming the route parameter is id_pesanan
    // const { name, email, whatsapp, id_event, type_ticket, qty, qr_code, ispaid, status } = req.body;
    const checkIspaidSQL = 'SELECT ispaid, status FROM participan WHERE id_pesanan = ?';
    db.query(checkIspaidSQL, [id_pesanan], (checkError, checkResult) => {
        if (checkError) {
            console.error("Error checking ispaid:", checkError);
            return res.status(500).json({
                message: "Error checking ispaid",
                error: checkError
            });
        }

        if (checkResult.length === 0) {
            return res.status(404).json({
                message: "Participant not found"
            });
        }

        const ispaid = checkResult[0].ispaid;
        const status = checkResult[0].status;

        if (ispaid === 0) {
            return res.json({
                message: "Not yet paid"
            });
        }

        if (status === "check in") {
            return res.json({
                message: "Already checked in"
            });
        }
        
        const updateStatusSQL = 'UPDATE participan SET status = ? , clock_in = ? WHERE id_pesanan = ?';
        const clockInTime = new Date().toLocaleString()
        // console.log(clockInTime)

        db.query(updateStatusSQL, ["check in", clockInTime ,id_pesanan], (updateError, updateResult) => {
            if (updateError) {
                console.error("Error updating participant:", updateError);
                res.status(500).json({
                    message: "Error updating participant",
                    error: updateError
                });
            }else {
                if (updateResult.affectedRows === 0) {
                    res.status(404).json({
                        message: "Participant not found"
                    });
                } else {
                    res.json({
                        message: "Check-in successful"
                    });
                }
            }
        })


    })
    // const sql = 'UPDATE participan SET status = ? WHERE id_pesanan = ?';
    // const status = "check in"
    // const values = [status, id_pesanan];

    // db.query(sql, values, (error, result) => {
    //     if (error) {
    //         console.error("Error updating participant:", error);
    //         res.status(500).json({
    //             message: "Error updating participant",
    //             error: error
    //         });
    //     } else {
    //         if (result.affectedRows === 0) {
    //             res.status(404).json({
    //                 message: "Participant not found"
    //             });
    //         } else {
    //             res.json({
    //                 message: "Updated"
    //             });
    //         }
    //     }
    // });
}

module.exports = {
    getAllParticipan,
    getParticipanbyID,
    postParticipan,
    putParticipan,
    deleteParticipan,
    deleteParticipanbyID,
    getAllParticipanRelation,
    getAllParticipanRelationbyID,
    checkinTicket
}