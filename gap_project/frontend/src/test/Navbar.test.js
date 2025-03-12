import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from '../components/NavBar';

jest.mock('../components/SubmitContext.js', () => ({
  useSubmit: jest.fn(() => jest.fn()), // Mock SubmitContext
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    search: '?company=TestCompany&gap_id=123',
  }),
}));

describe('NavBar component', () => {
  const links = [
    { name: 'Home', path: '/home', image: '/home.png' },
    { name: 'Dashboard', path: '/dashboard', image: '/dashboard.png' },
  ];

  test('renders NavBar with links', () => {
    render(
      <BrowserRouter>
        <NavBar links={links} logout={false} isComplete={false} />
      </BrowserRouter>
    );

    const toggleButton = screen.getByText('>>'); // Sidebar button when collapsed
    fireEvent.click(toggleButton);

    expect(screen.getByAltText('Gordon Foley Logo')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('toggles sidebar on button click', () => {
    render(
      <BrowserRouter>
        <NavBar links={links} logout={false} isComplete={false} />
      </BrowserRouter>
    );

    const toggleButton = screen.getByText('>>'); // Sidebar button when collapsed
    fireEvent.click(toggleButton);

    expect(screen.getByText('<<')).toBeInTheDocument(); // Expanded state
  });

  test('calls navigate on logout', async () => {
    render(
      <BrowserRouter>
        <NavBar links={links} logout={true} isComplete={false} />
      </BrowserRouter>
    );

    const toggleButton = screen.getByText('>>'); // Sidebar button when collapsed
    fireEvent.click(toggleButton);

    const logoutButton = screen.getAllByText('LOGOUT')[1];
    fireEvent.click(logoutButton);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('opens popup when clicking "Save and Exit"', () => {
    render(
      <BrowserRouter>
        <NavBar links={links} logout={false} isComplete={false} />
      </BrowserRouter>
    );

    const saveExitButton = screen.getByText('SAVE AND EXIT');
    fireEvent.click(saveExitButton);

    expect(screen.getByText('Would you like to save and come back later?')).toBeInTheDocument();
  });

  test('closes popup when clicking outside', () => {
    render(
      <BrowserRouter>
        <NavBar links={links} logout={false} isComplete={false} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('SAVE AND EXIT'));
    expect(screen.getByText('Would you like to save and come back later?')).toBeInTheDocument();

    fireEvent.mouseDown(document.body); // Simulate clicking outside popup
    expect(screen.queryByText('Would you like to save and come back later?')).not.toBeInTheDocument();
  });
});
