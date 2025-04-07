function loadEditProfile() {
    const userId = localStorage.getItem('userId'); // Get logged-in user's ID

    // Fetch user profile data from the backend
    fetch(`/api/users/${userId}`)
        .then(res => res.json())
        .then(data => {
            // Populate the page with existing data
            document.getElementById('profileAvatar').src = data.profile_picture || '/default-avatar.png';
            document.getElementById('profileUsername').textContent = data.username;
            document.getElementById('aboutInput').value = data.about || '';
        })
        .catch(err => console.error('Failed to load profile:', err));
}

function saveEditProfile() {
    const userId = localStorage.getItem('userId');
    const formData = new FormData();

    // Add "About Me" content to form data
    const aboutInput = document.getElementById('aboutInput').value;
    formData.append('about', aboutInput);

    // Add avatar file to form data if a new file is selected
    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput.files.length > 0) {
        formData.append('avatar', avatarInput.files[0]);
    }

    // Send profile update request to the backend
    fetch(`/api/users/${userId}/profile`, {
        method: 'POST',
        body: formData
    })
        .then(() => {
            window.location.reload(); // Refresh the page after saving changes
        })
        .catch(err => console.error('Failed to save profile:', err));
}

// Load edit profile data on page load
document.addEventListener('DOMContentLoaded', loadEditProfile);

// Save profile changes when the save button is clicked
document.getElementById('saveProfileButton').addEventListener('click', saveEditProfile);
