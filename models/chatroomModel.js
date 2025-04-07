const db = require('../config/db');

const Chatroom = {
    create: (name, avatar, about, callback) => {
        const query = 'INSERT INTO chatrooms (name, avatar, about) VALUES (?, ?, ?)';
        db.query(query, [name, avatar, about], callback);
    },
    findById: (id, callback) => {
        const query = 'SELECT * FROM chatrooms WHERE id = ?';
        db.query(query, [id], callback);
    },
    findAll: (callback) => {
        const query = 'SELECT * FROM chatrooms';
        db.query(query, [], callback);
    }
};

module.exports = Chatroom;
