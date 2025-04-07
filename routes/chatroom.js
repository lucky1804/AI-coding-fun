const express = require('express');
const db = require('../config/db');

// Initialize router
const router = express.Router();

// Create a new chatroom
router.post('/create', (req, res) => {
    const { name, avatar, about, created_by } = req.body;

    const query = 'INSERT INTO chatrooms (name, avatar, about, created_by) VALUES (?, ?, ?, ?)';
    db.query(query, [name, avatar, about, created_by], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({ message: 'Chatroom created successfully' });
    });
});

// Get all chatrooms
router.get('/', (req, res) => {
    const query = 'SELECT * FROM chatrooms';
    db.query(query, [], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(200).json(results);
    });
});

// Get chatroom by ID
router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM chatrooms WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err || results.length === 0)
            return res.status(404).json({ error: 'Chatroom not found' });

        res.status(200).json(results[0]);
    });
});

module.exports = router;
