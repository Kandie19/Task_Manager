// App.js 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomePage from './HomePage';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: '', category: '' });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/tasks', newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', priority: '', category: '' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredTasks = tasks.filter(task => {
    if (!filter) return true;
    return task.priority === filter || task.category === filter;
  });

  return (
    <div>
      <HomePage />
      <h1>Taskify</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={newTask.title} onChange={handleInputChange} />
        <input type="text" name="description" placeholder="Description" value={newTask.description} onChange={handleInputChange} />
        <select name="priority" value={newTask.priority} onChange={handleInputChange}>
          <option value="">Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input type="text" name="category" placeholder="Category" value={newTask.category} onChange={handleInputChange} />
        <button type="submit">Add Task</button>
      </form>
      <select value={filter} onChange={handleFilterChange}>
        <option value="">Show All</option>
        <option value="Low">Low Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="High">High Priority</option>
        <option value="Personal">Personal</option>
        <option value="Work">Work</option>
        {/* Add more options for categories */}
      </select>
      <ul>
        {filteredTasks.map(task => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.description} ({task.priority})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
