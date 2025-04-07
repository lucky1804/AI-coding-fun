const db = require('../config/db');

const Message = {
    create: (chatroomId, senderId, content, callback) => {
        const query = 'INSERT INTO messages (chatroom_id, sender_id, content) VALUES (?, ?, ?)';
        db.query(query, [chatroomId, senderId, content], callback);
    },
    findByChatroomId: (chatroomId, callback) => {
        const query = 'SELECT * FROM messages WHERE chatroom_id = ?';
        db.query(query, [chatroomId], callback);
    }
};

module.exports = Message;
