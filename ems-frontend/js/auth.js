const API_URL = 'http://localhost:8080/api';

// Set up Axios interceptor for JWT
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => {
        if (!res.ok) throw new Error('Invalid credentials');
        return res.json();
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        showToast('Login successful!');
        setTimeout(() => {
            window.location.href = data.role === 'ROLE_ADMIN' ? 'admin-dashboard.html' : 'employee-dashboard.html';
        }, 1000);
    })
    .catch(err => {
        showToast(err.message, 'error');
        const errorMsg = document.getElementById('error-message');
        if(errorMsg) errorMsg.textContent = 'Invalid email or password. Please try again.';
    });
}

function logout() {
    if(confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
}

function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token && !window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
        return;
    }
    
    if (user && user.role !== 'ROLE_ADMIN') {
        const adminPages = ['admin-dashboard.html', 'employees.html', 'departments.html', 'attendance.html', 'leaves.html', 'payroll.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (adminPages.includes(currentPage)) {
            window.location.href = 'employee-dashboard.html';
        }
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const userDisplay = document.getElementById('user-display-name');
    if (userDisplay) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            userDisplay.textContent = user.email;
        }
    }
});
