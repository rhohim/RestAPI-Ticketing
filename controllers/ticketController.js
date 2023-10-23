const db = require('../models/connection')

const getAllTicket = (req, res) => {
    const sql = "SELECT * FROM ticket" 
    db.query(sql, (error, result) => {
        if (error){
            res.status(500).json({
                message: "Error fetching ticket",
                error: error
            });
        } else {
            if (result.length === 0) {
                res.status(404).json({
                    message: "ticket not found"
                });
        } else {
                const formattedData = result.map(data => ({
                id: data.id,
                data : {
                    ticket_code : data.ticket_code,
                    ispaid : data.ispaid,
                    status : data.status,
                }
            }))
                res.json({
                    "data" : formattedData,
                    "message" : "success"
                })
        }
        }      
    })
}

const postTicket = (req, res) => {
    // console.log(req.body.name)
    // const { ticket_code, ispaid, status } = req.body
    const ticket_code = Math.random().toString(36).substring(2,10);
    
    const ispaid = false;
    const status = false;
    const sql = 'INSERT INTO ticket (ticket_code, ispaid, status) VALUES (?, ?, ?)'
    const values = [ticket_code, ispaid, status]

    db.query(sql, values, (error, result) =>{
        if (error) {
            // console.error("Error inserting participant:", error);
            res.status(500).json({
                message: "Error inserting ticket",
                error: error
            });
        } else {
            const idticket = result.insertId;
            const fetchTicketSQL = 'SELECT ticket_code FROM ticket WHERE id = ?';
            db.query(fetchTicketSQL, [idticket], (fetchError, fetchResult) => {
                if (fetchError) {
                    res.status(500).json({
                        message: "Error fetching inserted ticket",
                        error: fetchError
                    });
                } else {
                    const insertedTicket = fetchResult[0];
                    res.json({
                        message: "Success",
                        reference_id: insertedTicket.ticket_code
                    });
                }
            });
        }
    })
}

const deleteTicket = (req, res) => {
    const sql = 'DELETE FROM ticket';

    db.query(sql, (error, result) => {
        if (error) {
            console.error("Error deleting ticket:", error);
            res.status(500).json({
                message: "Error deleting ticket",
                error: error
            });
        } else {
            res.json({
                message: "deleted"
            });
        }
    });
}

const putTicket = (req, res) => {
    const ticketId = req.params.id;
    const { ticket_code, ispaid, status } = req.body;

    const sql = 'UPDATE ticket SET ticket_code = ?, ispaid = ?, status = ?';
    const values = [ticket_code, ispaid, status, ticketId];

    db.query(sql, values, (error, result) => {
        if (error) {
            console.error("Error updating ticket:", error);
            res.status(500).json({
                message: "Error updating ticket",
                error: error
            });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({
                    message: "ticket not found"
                });
            } else {
                res.json({
                    message: "Updated"
                });
            }
        }
    });
}

const getTicketbyID = (req, res) => {
    const ticketId = req.params.id;
    const sql = "SELECT * FROM ticket WHERE id = ?";
    db.query(sql, [ticketId], (error, result) => {
        if (error) {
            console.error("Error fetching ticket :", error);
            res.status(500).json({
                message: "Error fetching ticket ",
                error: error
            });
        } else {
            if (result.length === 0) {
                res.status(404).json({
                    message: "ticket not found"
                });
            } else {
                res.json({
                    id : result[0].id,
                    data: {
                        ticket_code : result[0].ticket_code,
                        ispaid : result[0].ispaid,
                        status : result[0].status,
                    },
                    message: "Success"
                });
            }
        }
    })
}

const deleteTicketbyID = (req, res) => {
    const ticketId = req.params.id;

    const sql = 'DELETE FROM ticket WHERE id = ?';

    db.query(sql, [ticketId], (error, result) => {
        if (error) {
            console.error("Error deleting ticket :", error);
            res.status(500).json({
                message: "Error deleting ticket ",
                error: error
            });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({
                    message: "ticket not found"
                });
            } else {
                res.json({
                    message: "deleted"
                });
            }
        }
    });
}

module.exports = {
    getAllTicket,
    postTicket,
    deleteTicket,
    putTicket,
    getTicketbyID,
    deleteTicketbyID
}

