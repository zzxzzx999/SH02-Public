import React from 'react';
import { act } from react-dom/test-utils;
import { render, screen } from '@testing-library/react';
import App from './components/App';

test('renders learn react link', () => {
  act(() => {
    render(<App />);
  });
  
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
