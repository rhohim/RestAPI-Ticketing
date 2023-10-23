const db = require('../models/connection')


const getAllEvent = (req, res) => {
    const sql = "SELECT * FROM event" 
    db.query(sql, (error, result) => {
        if (error){
            res.status(500).json({
                message: "Error fetching event",
                error: error
            });
        } else {
            if (result.length === 0) {
                res.status(404).json({ 
                    message: "event not found"
                });
        } else {
                const formattedData = result.map(data => ({
                    id: data.id,
                    data : {
                        name : data.name,
                        total : data.total
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

const postEvent = (req, res) => {
    console.log(req.body.name)
    const { name, total } = req.body
    const sql = 'INSERT INTO event (name, total) VALUES (?, ?)'
    const values = [name, total]

    db.query(sql, values, (error, result) =>{
        if (error) {
            // console.error("Error inserting participant:", error);
            res.status(500).json({
                message: "Error inserting event",
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

const deleteEvent = (req, res) => {
    const sql = 'DELETE FROM event';

    db.query(sql, (error, result) => {
        if (error) {
            console.error("Error deleting event:", error);
            res.status(500).json({
                message: "Error deleting event",
                error: error
            });
        } else {
            res.json({
                message: "deleted"
            });
        }
    });
}

const putEvent = (req, res) => {
    const eventId = req.params.id;
    const { total } = req.body; // Assuming the incoming value to add is named 'total'

    const getLastTotalSQL = 'SELECT total FROM event WHERE id = ?';
    db.query(getLastTotalSQL, [eventId], (getLastTotalError, getLastTotalResult) => {
    if (getLastTotalError) {
        res.status(500).json({
            message: "Error retrieving last total",
            error: getLastTotalError
        });
    } else {
        const lastTotal = getLastTotalResult[0]?.total || 0;
        const newTotal = lastTotal + total;

        const updateEventSQL = 'UPDATE event SET total = ? WHERE id = ?';
        const updateEventValues = [newTotal, eventId];

        db.query(updateEventSQL, updateEventValues, (updateError, updateResult) => {
            if (updateError) {
                console.error("Error updating event:", updateError);
                res.status(500).json({
                    message: "Error updating event",
                    error: updateError
                });
            } else {
                if (updateResult.affectedRows === 0) {
                    res.status(404).json({
                        message: "Event not found"
                    });
                } else {
                    res.json({
                        message: "Updated",
                        // newTotal: newTotal
                    });
                }
            }
        });
    }
});

    // const eventId = req.params.id;
    // const { name, total } = req.body;

    // const sql = 'UPDATE event SET name = ?, total = ?';
    // const values = [name, total, eventId];

    // db.query(sql, values, (error, result) => {
    //     if (error) {
    //         console.error("Error updating event:", error);
    //         res.status(500).json({
    //             message: "Error updating event",
    //             error: error
    //         });
    //     } else {
    //         if (result.affectedRows === 0) {
    //             res.status(404).json({
    //                 message: "event not found"
    //             });
    //         } else {
    //             res.json({
    //                 message: "Updated"
    //             });
    //         }
    //     }
    // });
}

const getEventbyID = (req, res) => {
    const eventId = req.params.id;
    const sql = "SELECT * FROM event WHERE id = ?";
    db.query(sql, [eventId], (error, result) => {
        if (error) {
            console.error("Error fetching event :", error);
            res.status(500).json({
                message: "Error fetching event ",
                error: error
            });
        } else {
            if (result.length === 0) {
                res.status(404).json({
                    message: "event not found"
                });
            } else {
                res.json({
                    id : result[0].id,
                    data: {
                        name : result[0].name,
                        total : result[0].total,
                    },
                    message: "Success"
                });
            }
        }
    })
}

const deleteEventbyID = (req, res) => {
    const eventId = req.params.id;

    const sql = 'DELETE FROM event WHERE id = ?';

    db.query(sql, [eventId], (error, result) => {
        if (error) {
            console.error("Error deleting event :", error);
            res.status(500).json({
                message: "Error deleting event ",
                error: error
            });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({
                    message: "event not found"
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
    getAllEvent,
    postEvent,
    deleteEvent,
    putEvent,
    getEventbyID,
    deleteEventbyID
}