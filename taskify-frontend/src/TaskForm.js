// TaskForm.js

import React, { useState } from 'react';

function TaskForm({ addTask }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    category: '',
    tags: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(formData);
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: '',
      category: '',
      tags: [],
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description"></textarea>
      <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} placeholder="Due Date" />
      <input type="text" name="priority" value={formData.priority} onChange={handleChange} placeholder="Priority" />
      <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
