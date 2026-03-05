const express = require("express");
const router = express.Router();
const db = require("../db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Register user
router.post("/register", async (req, res) => {

    const { name, email, password } = req.body;

    // INPUT VALIDATION
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();

        db.query(
            "INSERT INTO users (id,name,email,password) VALUES (?,?,?,?)",
            [id, name, email, hashedPassword],
            (err) => {

                if (err) {
                    return res.status(500).json({ message: "Database error", error: err });
                }

                res.json({ message: "User registered successfully" });

            }
        );

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


// Login user
router.post("/login", (req, res) => {

    const { email, password } = req.body;

    // INPUT VALIDATION
    if (!email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, result) => {

            if (err) {
                return res.status(500).json({ message: "Database error", error: err });
            }

            if (result.length === 0)
                return res.status(404).json({ message: "User not found" });

            const user = result[0];

            const valid = await bcrypt.compare(password, user.password);

            if (!valid)
                return res.status(401).json({ message: "Invalid password" });

            const token = jwt.sign(
                { id: user.id },
                "secretkey",
                { expiresIn: "1h" }
            );

            res.json({ token });

        }
    );
});

module.exports = router;