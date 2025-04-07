// Function to search for users
async function searchUsers() {
    const searchTerm = document.getElementById('userSearchInput').value;

    if (!searchTerm) {
        document.getElementById('searchResults').innerHTML = ''; // Clear results if input is empty
        return;
    }

    try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchTerm)}`);
        const results = await response.json();

        const resultsDiv = document.getElementById('searchResults');
        resultsDiv.innerHTML = ''; // Clear previous results

        if (results.length === 0) {
            resultsDiv.innerHTML = '<p>No users found.</p>';
            return;
        }

        results.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user-result';
            userDiv.innerHTML = `
                <img src="${user.profile_picture || '/default-avatar.png'}" alt="${user.username}" class="user-avatar">
                <span>${user.username}</span>
                <button onclick="viewUserProfile(${user.id})">View Profile</button>
            `;
            resultsDiv.appendChild(userDiv);
        });
    } catch (err) {
        console.error('Failed to search for users:', err);
    }
}

// Redirect to another user's profile page
function viewUserProfile(userId) {
    window.location.href = `/profile.html?user=${userId}`; // Redirect to profile page with user ID as query param
}

// Function to load friends
async function loadFriends() {
    const userId = localStorage.getItem('userId');

    try {
        const response = await fetch(`/api/users/${userId}/friends`);
        const friends = await response.json();

        const friendsDiv = document.getElementById('friends');
        friendsDiv.innerHTML = ''; // Clear previous friends list

        if (friends.length === 0) {
            friendsDiv.innerHTML = '<p>You have no friends added yet.</p>';
            return;
        }

        friends.forEach(friend => {
            const friendDiv = document.createElement('div');
            friendDiv.className = 'friend-item';
            friendDiv.innerHTML = `
                <img src="${friend.profile_picture || '/default-avatar.png'}" alt="${friend.username}" class="friend-avatar">
                <span>${friend.username}</span>
            `;
            friendsDiv.appendChild(friendDiv);
        });
    } catch (err) {
        console.error('Failed to load friends:', err);
    }
}

// Function to load chatrooms
async function loadChatrooms() {
    const userId = localStorage.getItem('userId');

    try {
        const response = await fetch(`/api/users/${userId}/chatrooms`);
        const chatrooms = await response.json();

        const chatroomsDiv = document.getElementById('chatrooms');
        chatroomsDiv.innerHTML = ''; // Clear previous chatroom list

        if (chatrooms.length === 0) {
            chatroomsDiv.innerHTML = '<p>You are not part of any chatrooms yet.</p>';
            return;
        }

        chatrooms.forEach(chatroom => {
            const chatroomDiv = document.createElement('div');
            chatroomDiv.className = 'chatroom-item';
            chatroomDiv.innerHTML = `
                <img src="${chatroom.avatar || '/default-chatroom.png'}" alt="${chatroom.name}" class="chatroom-avatar">
                <span>${chatroom.name}</span>
            `;
            chatroomsDiv.appendChild(chatroomDiv);
        });
    } catch (err) {
        console.error('Failed to load chatrooms:', err);
    }
}

// Load dashboard data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFriends(); // Fetch and display user's friends
    loadChatrooms(); // Fetch and display user's chatrooms
});
