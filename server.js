const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const chatroomRoutes = require('./routes/chatroom');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chatrooms', chatroomRoutes);

// Socket.IO for real-time messaging
io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('joinRoom', (chatroomId) => {
        socket.join(chatroomId);
        console.log(`User joined room ${chatroomId}`);
    });

    socket.on('sendMessage', ({ chatroomId, senderId, content }) => {
        const query = 'INSERT INTO messages (chatroom_id, sender_id, content) VALUES (?, ?, ?)';
        db.query(query, [chatroomId, senderId, content], (err) => {
            if (err) console.error(err);
            io.to(chatroomId).emit('newMessage', { senderId, content });
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start server
server.listen(3000, () => console.log('Server running on port 3000'));
