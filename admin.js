// ==========================================
// ADMIN - Messages Management
// ==========================================

// Check if user is logged in before loading the page
function checkLoginStatus() {
    if (!isLoggedIn()) {
        // Redirect to home page if not logged in
        window.location.href = '/';
        return false;
    }
    return true;
}

// Load messages when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check login first
    if (!checkLoginStatus()) {
        return;
    }

    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            Swal.fire({
                title: 'Logout?',
                text: 'Apakah Anda yakin ingin keluar?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#e91e63',
                cancelButtonColor: '#a18cd1',
                confirmButtonText: 'Ya, Logout',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    logout();
                }
            });
        });
    }

    loadMessages();
    // Refresh messages every 5 seconds
    setInterval(loadMessages, 5000);
});

// Fetch and display all messages
function loadMessages() {
    fetch('/api/messages')
        .then(response => response.json())
        .then(messages => {
            displayMessages(messages);
        })
        .catch(error => {
            console.error('Error loading messages:', error);
            showTableError('Gagal memuat pesan');
        });
}

// Display messages in table
function displayMessages(messages) {
    const tbody = document.querySelector('.messages-table tbody');
    const emptyState = document.getElementById('emptyState');
    
    if (messages.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    
    tbody.innerHTML = messages.map((msg, index) => {
        const date = new Date(msg.created_at).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Truncate message for display
        const displayMessage = msg.pesan.length > 50 ? msg.pesan.substring(0, 50) + '...' : msg.pesan;

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(msg.nama)}</td>
                <td>${escapeHtml(displayMessage)}</td>
                <td>${date}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn-view" onclick="viewMessage(${msg.id})">Lihat</button>
                        <button class="btn-delete" onclick="deleteMessage(${msg.id})">Hapus</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// View message details in modal
function viewMessage(id) {
    fetch(`/api/messages/${id}`)
        .then(response => response.json())
        .then(msg => {
            showMessageModal(msg);
        })
        .catch(error => {
            console.error('Error fetching message:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Gagal memuat detail pesan'
            });
        });
}

// Show modal with message details
function showMessageModal(msg) {
    const date = new Date(msg.created_at).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'messageModal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            <div class="modal-header">Detail Pesan 💌</div>
            <div class="modal-body">
                <div class="modal-field">
                    <div class="modal-label">Pengirim 👤</div>
                    <div class="modal-value">${escapeHtml(msg.nama)}</div>
                </div>
                <div class="modal-field">
                    <div class="modal-label">Pesan 💬</div>
                    <div class="modal-value">${escapeHtml(msg.pesan)}</div>
                </div>
                <div class="modal-field">
                    <div class="modal-label">Tanggal 📅</div>
                    <div class="modal-value">${date}</div>
                </div>
            </div>
        </div>
    `;

    // Remove any existing modal
    const existingModal = document.getElementById('messageModal');
    if (existingModal) {
        existingModal.remove();
    }

    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Close modal
function closeModal() {
    const modal = document.getElementById('messageModal');
    if (modal) {
        modal.remove();
    }
}

// Delete message
function deleteMessage(id) {
    Swal.fire({
        title: 'Hapus Pesan?',
        text: 'Pesan yang dihapus tidak bisa dikembalikan',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f5576c',
        cancelButtonColor: '#a18cd1',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/api/messages/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Pesan telah dihapus',
                    confirmButtonColor: '#8fd3f4'
                });
                loadMessages();
            })
            .catch(error => {
                console.error('Error deleting message:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'Gagal menghapus pesan'
                });
            });
        }
    });
}

// Helper function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Show error in table
function showTableError(message) {
    const tbody = document.querySelector('.messages-table tbody');
    tbody.innerHTML = `<tr class="loading-row"><td colspan="5" class="loading-text">${message}</td></tr>`;
}
