// index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

// Load tasks data from JSON file
const tasksPath = './data/tasks.json';
let tasks = [];
try {
  tasks = JSON.parse(fs.readFileSync(tasksPath));
} catch (error) {
  console.error('Error reading tasks data:', error);
}

// Save tasks data to JSON file
const saveTasks = () => {
  fs.writeFileSync(tasksPath, JSON.stringify(tasks, null, 2));
};

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
  const newTask = req.body;
  tasks.push(newTask);
  saveTasks();
  res.json(newTask);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
