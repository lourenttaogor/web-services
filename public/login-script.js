// Fetch and display user info on login page
const displayUserStatus = async () => {
    try {
        const userStatus = document.getElementById('userStatus');
        const authForms = document.getElementById('authForms');
        const response = await fetch('/api/user', { credentials: 'same-origin' });
        const userData = await response.json();

        if (userData.loggedIn) {
            authForms.style.display = 'none';
            userStatus.innerHTML = `
        <div class="user-info">
          <div>
            <p style="margin: 0; font-size: 18px;">Welcome, <strong>${userData.user.firstName || userData.user.displayName || userData.user.username}</strong>!</p>
            <p style="margin: 5px 0 0 0; color: #666;">You are logged in</p>
          </div>
        </div>
        <a href="/logout" class="btn btn-home" style="display: inline-block; margin-top: 15px;">Logout</a>
        <a href="/" class="btn btn-home">Back to Home</a>
      `;
        } else {
            authForms.style.display = 'block';
            userStatus.style.display = 'none';
        }
    } catch (error) {
        console.log('Error fetching user data:', error);
        document.getElementById('authForms').style.display = 'block';
    }
};

// Switch between login and signup tabs
function switchTab(tabName, event) {
    event.preventDefault();
    document.querySelectorAll('.form-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabName + 'Form').classList.add('active');
    event.target.classList.add('active');
}

// Show message
function showMessage(message, type) {
    const msgEl = document.getElementById('message');
    msgEl.textContent = message;
    msgEl.className = `message ${type} show`;
    setTimeout(() => msgEl.classList.remove('show'), 5000);
}

// Handle login form submission
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage('Login successful!', 'success');
                    setTimeout(() => {
                        // Redirect to subscriptions page after successful login
                        window.location.href = '/subscriptions';
                    }, 1000);
                } else {
                    showMessage(data.message || 'Login failed', 'error');
                }
            } catch (error) {
                showMessage('Error: ' + error.message, 'error');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signupEmail').value;
            const firstName = document.getElementById('signupFirstName').value;
            const lastName = document.getElementById('signupLastName').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;

            try {
                const response = await fetch('/users/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({ email, firstName, lastName, password, confirmPassword })
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage('Account created! Please log in.', 'success');
                    setTimeout(() => {
                        signupForm.reset();
                        switchTab('login');
                    }, 1500);
                } else {
                    showMessage(data.message || 'Sign up failed', 'error');
                }
            } catch (error) {
                showMessage('Error: ' + error.message, 'error');
            }
        });
    }
});

// Call on page load
displayUserStatus();
