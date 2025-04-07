function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            alert('Login successful!');
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user.id); // Save user ID for future requests
            window.location.href = '/dashboard.html'; // Redirect to dashboard
        }
    })
    .catch(err => console.error('Login failed:', err));
}
