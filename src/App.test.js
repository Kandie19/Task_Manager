// src/App.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

test('renders Taskify title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Taskify/i);
  expect(titleElement).toBeInTheDocument();
});

test('adds a new task', async () => {
  render(<App />);
  
  const addButton = screen.getByText(/Add Task/i);
  fireEvent.click(addButton);

  const titleInput = screen.getByPlaceholderText(/Title/i);
  const descriptionInput = screen.getByPlaceholderText(/Description/i);
  const dueDateInput = screen.getByPlaceholderText(/Due Date/i);
  const priorityInput = screen.getByPlaceholderText(/Priority/i);
  const categoryInput = screen.getByPlaceholderText(/Category/i);
  const tagsInput = screen.getByPlaceholderText(/Tags/i);
  const submitButton = screen.getByText(/Add Task/i);

  fireEvent.change(titleInput, { target: { value: 'Test Task' } });
  fireEvent.change(descriptionInput, { target: { value: 'This is a test task' } });
  fireEvent.change(dueDateInput, { target: { value: '2024-12-31' } });
  fireEvent.change(priorityInput, { target: { value: 'High' } });
  fireEvent.change(categoryInput, { target: { value: 'Testing' } });
  fireEvent.change(tagsInput, { target: { value: 'test' } });

  fireEvent.click(submitButton);

  // Wait for the task to appear in the list
  await waitFor(() => screen.getByText('Test Task'));

  expect(screen.getByText('Test Task')).toBeInTheDocument();
});
