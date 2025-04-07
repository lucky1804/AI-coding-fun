const express = require('express');
const db = require('../config/db');
const multer = require('multer'); // For file uploads

const router = express.Router();

// Configure multer for avatar uploads
const upload = multer({ dest: 'public/uploads/' });

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

    // Check if an avatar was uploaded
    let avatarPath = null;
    if (req.file) {
        avatarPath = `/uploads/${req.file.filename}`;
    }

    // Update query logic: Preserve existing avatar if no new one is uploaded
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
    const query = 'SELECT id, username, about, profile_picture FROM users WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err || results.length === 0)
            return res.status(404).json({ error: 'User not found' });

        res.status(200).json(results[0]);
    });
});


module.exports = router;
