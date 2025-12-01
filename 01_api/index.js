const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  // ✅ DB name already updated earlier
  database: process.env.DB_NAME || 'last_dit312',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Health check
app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok', db: rows[0].ok === 1 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// Get all movies
app.get('/movies', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM movie');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ NEW: Create a new movie (for the “add review” box)
app.post('/movies', async (req, res) => {
  try {
    const { name, detail, coverimage, rating, release_year } = req.body;

    if (!name || !detail) {
      return res.status(400).json({ error: 'Name and detail are required' });
    }

    const numericRating = rating !== undefined && rating !== null && rating !== ''
      ? Number(rating)
      : null;
    const numericYear = release_year !== undefined && release_year !== null && release_year !== ''
      ? Number(release_year)
      : null;

    const [result] = await pool.query(
      `INSERT INTO movie (name, detail, coverimage, rating, release_year)
       VALUES (?, ?, ?, ?, ?)`,
      [name, detail, coverimage || null, numericRating, numericYear]
    );

    const [rows] = await pool.query('SELECT * FROM movie WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error', message: e.message });
  }
});

// ✅ NEW: Delete a movie by id
app.delete('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM movie WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error', message: e.message });
  }
});

// Do NOT change this port
const port = Number(process.env.PORT || 3002);
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
