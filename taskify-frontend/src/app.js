//app.js
import React, { useState, useEffect } from 'react';
import { Calendar } from '@fullcalendar/react'; // Import Calendar component
import dayGridPlugin from '@fullcalendar/daygrid'; // Import DayGrid plugin
import TaskForm from './TaskForm'; // Import TaskForm component
import TaskList from './TaskList'; // Import TaskList component
import io from 'socket.io-client'; // Import socket.io-client library

const socket = io('http://localhost:3001'); // Assuming backend server is running on localhost:3001

function App() {
  // Define state for tasks using useState hook
  const [tasks, setTasks] = useState([]);

  // useEffect hook to fetch tasks from backend when component mounts
  useEffect(() => {
    fetchTasks(); // Fetch tasks from backend

    // Subscribe to real-time updates from server using WebSocket
    socket.on('taskUpdated', fetchTasks);

    // Clean up subscription when component unmounts
    return () => {
      socket.off('taskUpdated', fetchTasks);
    };
  }, []); // Empty dependency array ensures effect runs only on mount and unmount

  // Function to fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3001/tasks'); // Fetch tasks using GET request
      const data = await response.json(); // Parse response JSON
      setTasks(data); // Update tasks state with fetched data
    } catch (error) {
      console.error('Error fetching tasks:', error); // Log error if fetching tasks fails
    }
  };

  // Function to add a new task
  const addTask = async (taskData) => {
    try {
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST', // HTTP POST method to add task
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
        },
        body: JSON.stringify(taskData), // Convert task data to JSON string and send in request body
      });
      const data = await response.json(); // Parse response JSON
      setTasks([...tasks, data]); // Add newly created task to tasks list
      socket.emit('taskUpdated'); // Emit event to notify server of task update
    } catch (error) {
      console.error('Error adding task:', error); // Log error if adding task fails
    }
  };

  // Function to delete a task
  const deleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: 'DELETE', // HTTP DELETE method to delete task
      });
      setTasks(tasks.filter(task => task.id !== taskId)); // Remove deleted task from tasks list
      socket.emit('taskUpdated'); // Emit event to notify server of task update
    } catch (error) {
      console.error('Error deleting task:', error); // Log error if deleting task fails
    }
  };

  // Render components and pass necessary props
  return (
    <div className="App">
      <h1>Taskify</h1>
      <TaskForm addTask={addTask} /> {/* Render TaskForm component and pass addTask function as prop */}
      <TaskList tasks={tasks} deleteTask={deleteTask} /> {/* Render TaskList component and pass tasks list and deleteTask function as props */}

      {/* Calendar component */}
      <Calendar
        plugins={[dayGridPlugin]} // Specify plugins
        initialView="dayGridMonth" // Set initial view to month
        events={[]} // Pass events data (if any)
      />
    </div>
  );
}

export default App;
