const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Initialize router
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, hashedPassword], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'User registered successfully' });
    });
});

// Login a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                about: user.about,
                profile_picture: user.profile_picture
            }
        });
    });
});

module.exports = router;
