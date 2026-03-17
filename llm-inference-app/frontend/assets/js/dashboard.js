// ===========================
// Dashboard Functions
// ===========================

let chatHistory = [];

/**
 * Initialize dashboard
 */
async function initializeDashboard() {
    requireAuth();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userNameEl = document.getElementById('userName');
    const userAvatarEl = document.getElementById('userAvatar');
    const navLogoutBtn = document.getElementById('navLogoutBtn');

    // Display user info
    if (userNameEl && user.email) {
        userNameEl.textContent = user.email;
    }

    if (userAvatarEl && user.email) {
        userAvatarEl.textContent = user.email.charAt(0).toUpperCase();
    }

    // Logout buttons
    if (navLogoutBtn) {
        navLogoutBtn.addEventListener('click', logoutUser);
    }

    // Load chat history
    await loadInferenceHistory();

    // Handle form submission
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
        chatForm.addEventListener('submit', handleChatSubmit);
    }
}

/**
 * Load inference history from API
 */
async function loadInferenceHistory() {
    try {
        const response = await apiCall('/inference?limit=10', {
            method: 'GET'
        });

        if (response.success) {
            chatHistory = response.data || [];
            displayHistoryList();
        }
    } catch (error) {
        console.error('Failed to load history:', error);
    }
}

/**
 * Display history list in sidebar
 */
function displayHistoryList() {
    const historyList = document.getElementById('historyList');
    
    if (!historyList) return;

    if (chatHistory.length === 0) {
        historyList.innerHTML = '<p class="empty-state">No chat history yet</p>';
        return;
    }

    historyList.innerHTML = chatHistory.map((inference, index) => `
        <div class="history-item" onclick="loadInference('${inference.inferenceId}')">
            <div>
                <p>${inference.prompt.substring(0, 50)}...</p>
                <span>${formatDate(inference.createdAt)}</span>
            </div>
        </div>
    `).join('');
}

/**
 * Load specific inference from history
 */
async function loadInference(inferenceId) {
    try {
        const response = await apiCall(`/inference/${inferenceId}`, {
            method: 'GET'
        });

        if (response.success) {
            displayInferenceMessages(response.data);
        }
    } catch (error) {
        showError('inferenceError', 'Failed to load inference');
    }
}

/**
 * Display inference messages in chat
 */
function displayInferenceMessages(inference) {
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatMessages) return;

    chatMessages.innerHTML = `
        <div class="message user">
            <div class="message-content">
                ${escapeHtml(inference.prompt)}
                <div class="message-timestamp">${formatDate(inference.createdAt)}</div>
            </div>
        </div>
    `;

    if (inference.response) {
        chatMessages.innerHTML += `
            <div class="message ai">
                <div class="message-content">
                    ${escapeHtml(inference.response)}
                    <div class="message-timestamp">${formatDate(inference.completedAt)}</div>
                </div>
            </div>
        `;
    } else if (inference.status === 'pending' || inference.status === 'processing') {
        chatMessages.innerHTML += `
            <div class="message ai">
                <div class="message-content">
                    <em>Processing your request...</em>
                </div>
            </div>
        `;
    } else if (inference.status === 'error') {
        chatMessages.innerHTML += `
            <div class="message ai">
                <div class="message-content" style="color: #ef4444;">
                    <em>Error: ${escapeHtml(inference.errorMessage || 'Unknown error')}</em>
                </div>
            </div>
        `;
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Handle chat form submission
 */
async function handleChatSubmit(event) {
    event.preventDefault();

    const promptInput = document.getElementById('promptInput');
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const prompt = promptInput.value.trim();

    if (!prompt) {
        showError('chatError', 'Please enter a message');
        return;
    }

    try {
        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Display user message
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages && chatMessages.querySelector('.welcome-message')) {
            chatMessages.innerHTML = '';
        }

        const userMessageEl = document.createElement('div');
        userMessageEl.className = 'message user';
        userMessageEl.innerHTML = `
            <div class="message-content">
                ${escapeHtml(prompt)}
                <div class="message-timestamp">${formatDate(new Date())}</div>
            </div>
        `;
        chatMessages.appendChild(userMessageEl);

        // Submit to inference endpoint
        const response = await apiCall('/inference/submit', {
            method: 'POST',
            body: JSON.stringify({ prompt })
        });

        if (response.success) {
            // Display AI processing message
            const aiMessageEl = document.createElement('div');
            aiMessageEl.className = 'message ai';
            aiMessageEl.innerHTML = `
                <div class="message-content">
                    <em>Processing your request...</em>
                </div>
            `;
            chatMessages.appendChild(aiMessageEl);

            // Clear input
            promptInput.value = '';

            // Poll for result
            pollForInferenceResult(response.data.inferenceId, aiMessageEl);

            // Reload history
            setTimeout(loadInferenceHistory, 1000);
        }

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    } catch (error) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        if (error.data && error.data.message) {
            showError('chatError', error.data.message);
        } else {
            showError('chatError', 'Failed to send message');
        }
    }
}

/**
 * Poll for inference result
 */
async function pollForInferenceResult(inferenceId, messageElement, attempts = 0) {
    const maxAttempts = 30; // 5 minutes with 10 second intervals
    const pollInterval = 10000; // 10 seconds

    if (attempts >= maxAttempts) {
        messageElement.innerHTML = `
            <div class="message-content" style="color: #f59e0b;">
                <em>Request is taking longer than expected. Please check your chat history.</em>
            </div>
        `;
        return;
    }

    try {
        const response = await apiCall(`/inference/${inferenceId}`, {
            method: 'GET'
        });

        if (response.success) {
            const inference = response.data;

            if (inference.status === 'completed' && inference.response) {
                messageElement.innerHTML = `
                    <div class="message-content">
                        ${escapeHtml(inference.response)}
                        <div class="message-timestamp">${formatDate(inference.completedAt)}</div>
                    </div>
                `;
            } else if (inference.status === 'error') {
                messageElement.innerHTML = `
                    <div class="message-content" style="color: #ef4444;">
                        <em>Error: ${escapeHtml(inference.errorMessage || 'Unknown error')}</em>
                    </div>
                `;
            } else {
                // Still processing, poll again
                setTimeout(() => {
                    pollForInferenceResult(inferenceId, messageElement, attempts + 1);
                }, pollInterval);
            }
        }
    } catch (error) {
        console.error('Polling error:', error);
        setTimeout(() => {
            pollForInferenceResult(inferenceId, messageElement, attempts + 1);
        }, pollInterval);
    }
}

// ===========================
// Utility Functions
// ===========================

/**
 * Format date to readable string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===========================
// Initialize
// ===========================

document.addEventListener('DOMContentLoaded', initializeDashboard);
