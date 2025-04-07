function loadProfile() {
    const userId = localStorage.getItem('userId'); // Get logged-in user's ID

    // Fetch user profile data from the backend
    fetch(`/api/users/${userId}`)
        .then(res => res.json())
        .then(data => {
            // Populate the profile page with user data
            document.getElementById('profileAvatar').src = data.profile_picture || '/default-avatar.png';
            document.getElementById('profileUsername').textContent = data.username;
            document.getElementById('profileAbout').textContent = data.about || 'This user has not written anything about themselves.';

            // Show "Edit Profile" button if logged-in user is viewing their own profile
            if (parseInt(userId) === data.id) {
                document.getElementById('editProfileButton').style.display = 'block';
            }
        })
        .catch(err => console.error('Failed to load profile:', err));
}

// Load profile when the page is loaded
document.addEventListener('DOMContentLoaded', loadProfile);
