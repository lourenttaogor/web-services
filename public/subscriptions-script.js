// Load user info and subscriptions on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Subscriptions page loaded');
    loadUserInfo();
    loadSubscriptions();
    setupFormHandler();
});

// Load and display user information
const loadUserInfo = async () => {
    try {
        const response = await fetch('/api/user', { credentials: 'same-origin' });
        const userData = await response.json();

        if (userData.loggedIn) {
            document.getElementById('userName').textContent = `Welcome, ${userData.user.firstName || userData.user.displayName || 'User'}!`;
        } else {
            // Redirect to login if not logged in
            window.location.href = '/login-page';
        }
    } catch (error) {
        console.error('Error loading user info:', error);
        window.location.href = '/login-page';
    }
};

// Fetch all subscriptions for the logged-in user
const loadSubscriptions = async () => {
    try {
        const response = await fetch('/subscription', { credentials: 'same-origin' });

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '/login-page';
                return;
            }
            throw new Error('Failed to load subscriptions');
        }

        const subscriptions = await response.json();
        displaySubscriptions(subscriptions);
    } catch (error) {
        console.error('Error loading subscriptions:', error);
        showMessage('Error loading subscriptions', 'error');
    }
};

// Display subscriptions in the list
const displaySubscriptions = (subscriptions) => {
    const listContainer = document.getElementById('subscriptionsList');

    if (!subscriptions || subscriptions.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <p>No subscriptions yet. Add one to get started!</p>
            </div>
        `;
        updateStats([], false);
        return;
    }

    let html = '';
    subscriptions.forEach(sub => {
        const renewalDate = sub.renewalDate ? new Date(sub.renewalDate).toLocaleDateString() : 'Not set';
        const statusColor = sub.status === 'Active' ? '#27ae60' : sub.status === 'Trial' ? '#f39c12' : '#95a5a6';

        html += `
            <div class="subscription-item">
                <div class="subscription-header">
                    <div class="subscription-name">${sub.providerName}</div>
                    <div class="subscription-cost">$${parseFloat(sub.monthlyCost).toFixed(2)}/mo</div>
                </div>
                <div class="subscription-details">
                    <div class="detail-item">
                        <span class="detail-label">Category</span>
                        <span>${sub.category}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Status</span>
                        <span style="color: ${statusColor}; font-weight: 600;">${sub.status || 'Active'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Renewal Date</span>
                        <span>${renewalDate}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Payment Method</span>
                        <span>${sub.paymentMethod || 'Not specified'}</span>
                    </div>
                </div>
                ${sub.description ? `<p style="font-size: 13px; color: #666; margin-bottom: 10px;"><strong>Notes:</strong> ${sub.description}</p>` : ''}
                <div class="subscription-actions">
                    <button class="delete-btn" onclick="deleteSubscription('${sub._id}')">Delete</button>
                </div>
            </div>
        `;
    });

    listContainer.innerHTML = html;
    updateStats(subscriptions, true);
};

// Update statistics
const updateStats = (subscriptions, hasData) => {
    if (!hasData || subscriptions.length === 0) {
        document.getElementById('totalCost').textContent = '$0.00';
        document.getElementById('activeCount').textContent = '0';
        return;
    }

    const totalCost = subscriptions.reduce((sum, sub) => sum + parseFloat(sub.monthlyCost || 0), 0);
    const activeCount = subscriptions.filter(sub => sub.status === 'Active').length;

    document.getElementById('totalCost').textContent = `$${totalCost.toFixed(2)}`;
    document.getElementById('activeCount').textContent = activeCount;
};

// Setup form submission handler
const setupFormHandler = () => {
    const form = document.getElementById('subscriptionForm');

    if (!form) {
        console.error('Subscription form not found');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted');

        const providerName = document.getElementById('providerName').value.trim();
        const category = document.getElementById('category').value;
        const monthlyCost = document.getElementById('monthlyCost').value;
        const renewalDate = document.getElementById('renewalDate').value || null;
        const paymentMethod = document.getElementById('paymentMethod').value || null;
        const status = document.getElementById('status').value || 'Active';
        const description = document.getElementById('description').value.trim() || null;

        // Validate required fields
        if (!providerName) {
            showMessage('Provider name is required', 'error');
            return;
        }

        if (!category) {
            showMessage('Please select a category', 'error');
            return;
        }

        const costNum = parseFloat(monthlyCost);
        if (isNaN(costNum) || costNum < 0) {
            showMessage('Please enter a valid monthly cost', 'error');
            return;
        }

        const subscriptionData = {
            providerName,
            category,
            monthlyCost: costNum,
            renewalDate,
            paymentMethod,
            status,
            description
        };

        console.log('Sending subscription data:', subscriptionData);

        try {
            const response = await fetch('/subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(subscriptionData)
            });

            const data = await response.json();
            console.log('Response from server:', response.status, data);

            if (response.ok) {
                showMessage('Subscription added successfully!', 'success');
                form.reset();
                // Reload subscriptions list after a short delay
                setTimeout(() => loadSubscriptions(), 500);
            } else {
                showMessage(data.message || 'Error adding subscription', 'error');
            }
        } catch (error) {
            console.error('Error adding subscription:', error);
            showMessage('Error: ' + error.message, 'error');
        }
    });
};

// Delete subscription
const deleteSubscription = async (id) => {
    if (!confirm('Are you sure you want to delete this subscription?')) {
        return;
    }

    try {
        const response = await fetch(`/subscription/${id}`, {
            method: 'DELETE',
            credentials: 'same-origin'
        });

        if (response.ok || response.status === 204) {
            showMessage('Subscription deleted successfully!', 'success');
            loadSubscriptions();
        } else {
            const data = await response.json();
            showMessage(data.message || 'Error deleting subscription', 'error');
        }
    } catch (error) {
        console.error('Error deleting subscription:', error);
        showMessage('Error: ' + error.message, 'error');
    }
};

// Show message
function showMessage(message, type) {
    const msgEl = document.getElementById('message');
    msgEl.textContent = message;
    msgEl.className = `message ${type} show`;
    setTimeout(() => msgEl.classList.remove('show'), 5000);
}

// Logout
const logout = async () => {
    try {
        await fetch('/logout', { credentials: 'same-origin' });
        window.location.href = '/login-page';
    } catch (error) {
        console.error('Error logging out:', error);
        window.location.href = '/login-page';
    }
};