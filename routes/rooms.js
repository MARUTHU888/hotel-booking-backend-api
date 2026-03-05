const express = require("express");
const router = express.Router();
const db = require("../db");


// Get all available rooms
router.get("/", (req, res) => {

    db.query("SELECT * FROM rooms WHERE available = true", (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });

});


// Search rooms by check-in and check-out
router.get("/search", (req, res) => {

    const { check_in, check_out } = req.query;

    const query = `
    SELECT * FROM rooms
    WHERE id NOT IN (
        SELECT room_id FROM bookings
        WHERE NOT (
            check_out <= ? OR check_in >= ?
        )
    )
    `;

    db.query(query, [check_in, check_out], (err, result) => {

        if (err) return res.status(500).json(err);

        res.json(result);
    });

});


module.exports = router;