// App.js

import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Assuming backend server is running on localhost:3001

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks from the backend when the component mounts
    fetchTasks();

    // Subscribe to real-time updates from the server
    socket.on('taskUpdated', fetchTasks);

    return () => {
      // Clean up subscription when component unmounts
      socket.off('taskUpdated', fetchTasks);
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3001/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (taskData) => {
    try {
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      setTasks([...tasks, data]);
      socket.emit('taskUpdated');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter(task => task.id !== taskId));
      socket.emit('taskUpdated');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="App">
      <h1>Taskify</h1>
      <TaskForm addTask={addTask} />
      <TaskList tasks={tasks} deleteTask={deleteTask} />
    </div>
  );
}

export default App;
