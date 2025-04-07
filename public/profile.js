function loadProfile() {
    const userId = localStorage.getItem('userId');

    fetch(`/api/users/${userId}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('about').value = data.about || '';
        });
}

function saveProfile(event) {
    event.preventDefault();

    const userId = localStorage.getItem('userId');
    const formData = new FormData(document.getElementById('profileForm'));

    fetch(`/api/users/${userId}/profile`, {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => alert(data.message));
}

// Load profile on page load
document.addEventListener('DOMContentLoaded', loadProfile);

// Save profile changes on form submission
document.getElementById('profileForm').addEventListener('submit', saveProfile);
