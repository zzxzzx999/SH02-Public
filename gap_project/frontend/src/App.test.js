import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './components/App';

test('renders login button', () => {
  render(<App />);
  const loginButton = screen.getByText(/log in/i);  // Looks for "LOG IN" button
  expect(loginButton).toBeInTheDocument();
});
