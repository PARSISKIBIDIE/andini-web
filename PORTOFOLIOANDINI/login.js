// ==========================================
// LOGIN SYSTEM FOR ANDINI
// ==========================================

// Credentials (Simple - for production should use proper authentication)
const VALID_USERNAME = "andini";
const VALID_PASSWORD = "Andini123!";

// Get DOM elements
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const loginModalClose = document.getElementById('loginModalClose');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Open login modal
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
        usernameInput.focus();
    });
}

// Close login modal
if (loginModalClose) {
    loginModalClose.addEventListener('click', () => {
        loginModal.classList.remove('active');
        clearLoginForm();
    });
}

// Close modal when clicking outside
if (loginModal) {
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
            clearLoginForm();
        }
    });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginModal && loginModal.classList.contains('active')) {
        loginModal.classList.remove('active');
        clearLoginForm();
    }
});

// Handle login form submission
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate credentials
        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            // Login successful
            loginSuccess();
        } else {
            // Login failed
            loginFailed();
        }
    });
}

// Handle successful login
function loginSuccess() {
    // Store login session in localStorage
    localStorage.setItem('andini_logged_in', 'true');
    localStorage.setItem('login_timestamp', new Date().getTime());

    // Show success message
    Swal.fire({
        title: 'Login Berhasil! 🎉',
        text: 'Selamat datang kembali, Andini! 🌸',
        icon: 'success',
        confirmButtonColor: '#e91e63',
        background: '#fffaf0',
        allowOutsideClick: false
    }).then(() => {
        // Clear form and close modal
        clearLoginForm();
        loginModal.classList.remove('active');
        
        // Redirect to messages dashboard
        setTimeout(() => {
            window.location.href = '/messages';
        }, 500);
    });
}

// Handle failed login
function loginFailed() {
    Swal.fire({
        title: 'Login Gagal! 😅',
        text: 'Username atau Password salah. Coba lagi!',
        icon: 'error',
        confirmButtonColor: '#e91e63',
        background: '#fffaf0'
    });
    
    // Clear password field
    passwordInput.value = '';
    passwordInput.focus();
}

// Clear login form
function clearLoginForm() {
    if (loginForm) {
        loginForm.reset();
    }
}

// Check if user is logged in (for messages page protection)
function isLoggedIn() {
    const loggedIn = localStorage.getItem('andini_logged_in');
    return loggedIn === 'true';
}

// Logout function
function logout() {
    localStorage.removeItem('andini_logged_in');
    localStorage.removeItem('login_timestamp');
    window.location.href = '/';
}
