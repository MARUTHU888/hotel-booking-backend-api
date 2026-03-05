const express = require("express");
const router = express.Router();
const db = require("../db");
const { v4: uuidv4 } = require("uuid");


// Create a booking (reserve a room)
router.post("/", (req, res) => {

    const { user_id, room_id, check_in, check_out } = req.body;

    const id = uuidv4();

    const query = `
        INSERT INTO bookings (id, user_id, room_id, check_in, check_out)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [id, user_id, room_id, check_in, check_out], (err) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({ message: "Room booked successfully", booking_id: id });

    });

});


// Delete a booking (cancel reservation)
router.delete("/:id", (req, res) => {

    const bookingId = req.params.id;

    db.query("DELETE FROM bookings WHERE id = ?", [bookingId], (err) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({ message: "Booking cancelled successfully" });

    });

});


module.exports = router;