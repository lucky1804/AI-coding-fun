const express = require('express');
const db = require('../config/db');
const multer = require('multer'); // For file uploads

const router = express.Router();

// Configure multer for avatar uploads
const upload = multer({ dest: 'public/uploads/' });

// 🔍 Search for users by username — moved to top to avoid route collision
router.get('/search', (req, res) => {
    console.log('Search endpoint hit'); // Debugging log

    const searchTerm = req.query.q;

    if (!searchTerm) {
        console.log('No search term provided');
        return res.status(400).json({ error: 'Search term is required' });
    }

    const query = `
        SELECT id, username, profile_picture
        FROM users
        WHERE username LIKE ?
        LIMIT 10
    `;

    db.query(query, [`%${searchTerm}%`], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }

        console.log('Search results:', results); // Debugging line
        res.status(200).json(results || []);
    });
});

// Get user's friends
router.get('/:id/friends', (req, res) => {
    const query = `
        SELECT users.id, users.username, users.profile_picture
        FROM friends
        JOIN users ON friends.friend_id = users.id
        WHERE friends.user_id = ? AND friends.status = 'accepted'
    `;
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Get user's chatrooms
router.get('/:id/chatrooms', (req, res) => {
    const query = `
        SELECT chatrooms.id, chatrooms.name, chatrooms.avatar
        FROM chatrooms
        WHERE chatrooms.created_by = ?
    `;
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Update user profile
router.post('/:id/profile', upload.single('avatar'), (req, res) => {
    const { about } = req.body;
    const userId = req.params.id;

    let avatarPath = null;
    if (req.file) {
        avatarPath = `/uploads/${req.file.filename}`;
    }

    const query = `
        UPDATE users
        SET about = ?, profile_picture = COALESCE(?, profile_picture)
        WHERE id = ?
    `;
    db.query(query, [about, avatarPath, userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Profile updated successfully' });
    });
});

// Get user profile by ID
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    console.log(`Fetching user with id: ${userId}`); // Debugging

    const query = 'SELECT id, username, about, profile_picture FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('DB error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            console.warn(`No user found with id ${userId}`);
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(results[0]);
    });
});

module.exports = router;
