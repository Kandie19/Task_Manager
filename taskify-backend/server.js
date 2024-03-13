// server.js

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '$Ummer1992',
  database: 'task_manager_db'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Routes

// Get all tasks
app.get('/tasks', (req, res) => {
  const sql = 'SELECT * FROM tasks';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching tasks from database' });
      return;
    }
    res.json(result);
  });
});

// Add a new task
app.post('/tasks', (req, res) => {
  const { title, description, dueDate, priority, category, tags } = req.body;
  const sql = 'INSERT INTO tasks (title, description, dueDate, priority, category, tags) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [title, description, dueDate, priority, category, tags], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error adding task to database' });
      return;
    }
    res.json({ id: result.insertId, title, description, dueDate, priority, category, tags });
  });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.query(sql, [taskId], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error deleting task from database' });
      return;
    }
    res.sendStatus(200);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
