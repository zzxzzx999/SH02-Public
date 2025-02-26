// Login.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login.js';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
 
// Mock axios
jest.mock('axios');
 
// Create a mock for useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));
 
describe('Login component', () => {
  beforeEach(() => {
    // Reset mocks and clear localStorage before each test
    jest.clearAllMocks();
    localStorage.clear();
  });
 
  // Helper to render the component inside a Router
  const renderComponent = () =>
    render(
<BrowserRouter>
<Login />
</BrowserRouter>
    );
 
  test('renders login form with username and password inputs and submit button', () => {
    renderComponent();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });
 
  test('toggles password visibility when icon is clicked', () => {
    renderComponent();
    const passwordInput = screen.getByPlaceholderText(/password/i);
    // The icon should have an alt text that indicates its function.
    const toggleIcon = screen.getByAltText(/show password/i);
    // Initially, the input should be of type "password"
    expect(passwordInput).toHaveAttribute('type', 'password');
 
    // Click the icon to toggle visibility
    fireEvent.click(toggleIcon);
    expect(passwordInput).toHaveAttribute('type', 'text');
 
    // Toggle back
    fireEvent.click(screen.getByAltText(/hide password/i));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
 
  test('successful login for admin user navigates to /list-of-companies', async () => {
    // Setup axios to resolve with a fake admin response
    const fakeResponse = {
      data: {
        token: 'fakeToken',
        username: 'GAPAdmin',
        is_admin: true,
        role: 'admin',
      },
    };
    axios.post.mockResolvedValueOnce(fakeResponse);
 
    renderComponent();
 
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'GAPAdmin' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: '1' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
 
    // Wait for the axios call to be made
    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/login/', {
        username: 'GAPAdmin',
        password: '1',
      })
    );
 
    // Check that localStorage values have been set
    expect(localStorage.getItem('authToken')).toBe('fakeToken');
    expect(localStorage.getItem('username')).toBe('adminUser');
    expect(localStorage.getItem('isAdmin')).toBe("true"); // stored as string
    expect(localStorage.getItem('role')).toBe('admin');
    expect(localStorage.getItem('userRole')).toBe('admin');
 
    // Verify navigation was called with the admin route
    await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledWith('/list-of-companies'));
  });
 
  test('successful login for non-admin user navigates to /home', async () => {
    // Setup axios to resolve with a fake non-admin response
    const fakeResponse = {
      data: {
        token: 'fakeToken',
        username: 'notadmin',
        is_admin: false,
        role: 'client',
      },
    };
    axios.post.mockResolvedValueOnce(fakeResponse);
 
    renderComponent();
 
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'notadmin' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: '1' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
 
    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/login/', {
        username: 'notadmin',
        password: '1',
      })
    );
 
    // Check localStorage for non-admin user
    expect(localStorage.getItem('authToken')).toBe('fakeToken');
    expect(localStorage.getItem('username')).toBe('clientUser');
    expect(localStorage.getItem('isAdmin')).toBe("false");
    expect(localStorage.getItem('role')).toBe('client');
    expect(localStorage.getItem('userRole')).toBe('client');
 
    // Verify navigation was called with the client route
    await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledWith('/home'));
  });
 
  test('displays error message on login failure', async () => {
    // Setup axios to reject the login request
    const errorResponse = {
      response: {
        data: {
          detail: 'Invalid username or password.',
        },
      },
    };
    axios.post.mockRejectedValueOnce(errorResponse);
 
    renderComponent();
 
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'wrongUser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongPassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
 
    // Wait for the error message to appear
    await waitFor(() =>
      expect(screen.getByText(/invalid username or password./i)).toBeInTheDocument()
    );
 
    // Ensure that localStorage values are cleared on error
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('username')).toBeNull();
  });
});