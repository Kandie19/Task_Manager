const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Create a MySQL database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '$Ummer1992',
  database: 'task_manager_db'
});

// Connect to the database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
    return;
  }
  console.log('Connected to the database');
});

// Middleware to enable CORS
app.use(cors());
app.use(express.json());

// Define API endpoints

// GET all tasks
app.get('/api/tasks', (req, res) => {
  connection.query('SELECT * FROM tasks', (error, results) => {
    if (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'An error occurred while fetching tasks' });
    } else {
      res.json(results);
    }
  });
});

// POST a new task
app.post('/api/tasks', (req, res) => {
  const { title, description, dueDate, priority, category, tags } = req.body;
  connection.query(
    'INSERT INTO tasks (title, description, dueDate, priority, category, tags) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, dueDate, priority, category, tags],
    (error, result) => {
      if (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ error: 'An error occurred while adding the task' });
      } else {
        res.status(201).json({ id: result.insertId, title, description, dueDate, priority, category, tags });
      }
    }
  );
});

// DELETE a task by ID
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  connection.query('DELETE FROM tasks WHERE id = ?', taskId, (error, result) => {
    if (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'An error occurred while deleting the task' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: `Task with ID ${taskId} not found` });
    } else {
      res.status(204).end();
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
