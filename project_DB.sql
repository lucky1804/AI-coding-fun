CREATE DATABASE discord_clone;

USE discord_clone;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    about TEXT,
    profile_picture VARCHAR(255)
);

-- Friends Table (for friend requests)
CREATE TABLE friends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    status ENUM('pending', 'accepted') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friend_id) REFERENCES users(id)
);

-- Chatrooms Table
CREATE TABLE chatrooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    about TEXT,
    created_by INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Messages Table
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chatroom_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chatroom_id) REFERENCES chatrooms(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);
