function loadAvatar() {
    const userId = localStorage.getItem('userId'); // Get logged-in user's ID

    // Fetch user profile data to load avatar
    fetch(`/api/users/${userId}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('smallAvatar').src = data.profile_picture || '/default-avatar.png';
        })
        .catch(err => console.error('Failed to load user avatar:', err));
}

function viewProfile() {
    window.location.href = '/profile.html';
}

// Load avatar when the page is loaded
document.addEventListener('DOMContentLoaded', loadAvatar);
