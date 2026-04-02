const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Database setup
const db = new sqlite3.Database('./messages.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        // Create table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nama TEXT NOT NULL,
                pesan TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }
});

// API Routes

// POST - Receive new message
app.post('/api/messages', (req, res) => {
    const { nama, pesan } = req.body;

    if (!nama || !pesan) {
        return res.status(400).json({ error: 'Nama dan pesan harus diisi' });
    }

    const stmt = db.prepare('INSERT INTO messages (nama, pesan) VALUES (?, ?)');
    stmt.run(nama, pesan, function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Gagal menyimpan pesan' });
        }
        res.json({ 
            success: true, 
            message: 'Pesan berhasil dikirim!',
            id: this.lastID 
        });
    });
    stmt.finalize();
});

// GET - Retrieve all messages
app.get('/api/messages', (req, res) => {
    db.all('SELECT id, nama, pesan, created_at FROM messages ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Gagal mengambil data' });
        }
        res.json(rows);
    });
});

// GET - Retrieve single message
app.get('/api/messages/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT id, nama, pesan, created_at FROM messages WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Gagal mengambil data' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Pesan tidak ditemukan' });
        }
        res.json(row);
    });
});

// DELETE - Delete a message
app.delete('/api/messages/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM messages WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Gagal menghapus pesan' });
        }
        res.json({ success: true, message: 'Pesan berhasil dihapus' });
    });
});

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/messages', (req, res) => {
    res.sendFile(path.join(__dirname, 'messages.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
