import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import React from 'react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import DetailScore from '../components/DetailScore';

// Mock axios
jest.mock('axios');

// Mock useLocation and useNavigate
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
}));

// Mock NavBar component
jest.mock('../components/NavBar.js', () => () => <div>Mocked NavBar</div>);

// Mock PieChart component
jest.mock('../components/charts/PieChart.js', () => () => <div>Mocked PieChart</div>);

describe('DetailScore Component', () => {
    const mockLocation = {
        search: '?company=TestCompany&title=Policy&gap_id=123',
    };

    const mockNavigate = jest.fn();

    beforeEach(() => {
        useLocation.mockReturnValue(mockLocation);
        useNavigate.mockReturnValue(mockNavigate);
        localStorage.setItem('userRole', 'admin');
    });

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('renders the component with correct company and element name', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                scores: {
                    exceptionalCompliance: 5,
                    goodCompliance: 4,
                    basicCompliance: 3,
                    needsImprovement: 2,
                    unsatisfactory: 1,
                },
            },
        });

        axios.get.mockResolvedValueOnce({
            data: [
                { label:'Exceptional Compliance', value:5},
                { label:'Good Compliance', value:4},
                { label:'Basic Compliance', value:3},
                { label:'Needs Improvement', value:2},
                { label:'Unsatisfactory', value:1},
            ],
        });

        render(
            <MemoryRouter>
                <DetailScore />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Policy')).toBeInTheDocument();
            expect(screen.getByText('15/50')).toBeInTheDocument();
        });
    });

    it('handles API errors', async () => {
        // Mock the first axios.get call (fetching scores)
        axios.get.mockResolvedValueOnce({
            data: {
                scores: {
                    exceptionalCompliance: 5,
                    goodCompliance: 4,
                    basicCompliance: 3,
                    needsImprovement: 2,
                    unsatisfactory: 1,
                },
            },
        });

        // Mock the second axios.get call (fetching pie chart data) to simulate an error
        axios.get.mockRejectedValueOnce(new Error('API Error'));
        // Spy on console.error to verify it is called
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <MemoryRouter>
                <DetailScore />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(screen.getByText('Policy')).toBeInTheDocument();
            expect(screen.getByText('0/50')).toBeInTheDocument();
        });
        // Verify console.error was called with the expected error
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching element scores:', expect.any(Error));
        // Restore the original console.error
        consoleErrorSpy.mockRestore();
    });

    it('navigates to the next element on next button click', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                scores: {
                    exceptionalCompliance: 5,
                    goodCompliance: 4,
                    basicCompliance: 3,
                    needsImprovement: 2,
                    unsatisfactory: 1,
                },
            },
        });

        axios.get.mockResolvedValueOnce({
            data: [
                { label:'Exceptional Compliance', value:5},
                { label:'Good Compliance', value:4},
                { label:'Basic Compliance', value:3},
                { label:'Needs Improvement', value:2},
                { label:'Unsatisfactory', value:1},
            ],
        });

        render(
            <MemoryRouter>
                <DetailScore />
            </MemoryRouter>
        );

        await waitFor(() => {
            const nextButton = screen.getByText('>');
            nextButton.click();
            expect(mockNavigate).toHaveBeenCalledWith('/detail-score?company=TestCompany&gap_id=123&title=Management'); // will go to management title page
        });
    });

    it('navigates to the previous element on previous button click', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                scores: {
                    exceptionalCompliance: 5,
                    goodCompliance: 4,
                    basicCompliance: 3,
                    needsImprovement: 2,
                    unsatisfactory: 1,
                },
            },
        });

    axios.get.mockResolvedValueOnce({
        data: [
            { label:'Exceptional Compliance', value:5},
            { label:'Good Compliance', value:4},
            { label:'Basic Compliance', value:3},
            { label:'Needs Improvement', value:2},
            { label:'Unsatisfactory', value:1},
        ],
    });

    // Render the component with the first element (Policy)
    render(
        <MemoryRouter initialEntries={['/detail-score?company=TestCompany&gap_id=123&title=Policy']}> 
          <DetailScore />
        </MemoryRouter>
    );

      await waitFor(() => {
        // Click the previous button
        const previousButton = screen.getByText(/</i);
        previousButton.click();
        // Ensure navigate was NOT called
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
  });
  