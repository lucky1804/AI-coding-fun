function loadDashboard() {
    const userId = localStorage.getItem('userId'); // Get logged-in user's ID

    // Fetch user profile data to load avatar
    fetch(`/api/users/${userId}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('smallAvatar').src = data.profile_picture || '/default-avatar.png';
        })
        .catch(err => console.error('Failed to load user data:', err));

    // Fetch user's friends
    fetch(`/api/users/${userId}/friends`)
        .then(res => res.json())
        .then(data => {
            const friendsDiv = document.getElementById('friends');
            data.forEach(friend => {
                const friendElement = document.createElement('div');
                friendElement.innerHTML = `
                    <img src="${friend.profile_picture}" alt="${friend.username}" width="50">
                    <span>${friend.username}</span>`;
                friendsDiv.appendChild(friendElement);
            });
        });

    // Fetch user's chatrooms
    fetch(`/api/users/${userId}/chatrooms`)
        .then(res => res.json())
        .then(data => {
            const chatroomsDiv = document.getElementById('chatrooms');
            data.forEach(chatroom => {
                const chatroomElement = document.createElement('div');
                chatroomElement.innerHTML = `
                    <img src="${chatroom.avatar}" alt="${chatroom.name}" width="50">
                    <span>${chatroom.name}</span>`;
                chatroomsDiv.appendChild(chatroomElement);
            });
        });
}

function viewProfile() {
    window.location.href = '/profile.html';
}

// Load dashboard data on page load
document.addEventListener('DOMContentLoaded', loadDashboard);
