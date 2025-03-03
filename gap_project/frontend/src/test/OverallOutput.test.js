import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import OverallOutput from '../components/OverallOutput';

// Mock axios
jest.mock('axios');

// Mock NavBar component
jest.mock('../components/NavBar.js', () => () => <div>Mocked NavBar</div>);

// Mock LineChart and BarChart components
jest.mock('../components/charts/LinePotential.js', () => () => <div>Mocked LineChart</div>);
jest.mock('../components/charts/BarPotential.js', () => () => <div>Mocked BarChart</div>);

describe('OverallOutput Component', () => {
    const mockOverallScores = {
        percentages: {
            basic: 50,
            needsImprovement: 30,
            unsatisfactory: 20,
        },
        total_score: 450,
    };

    const mockBarChartData = {
        categories: ['Category 1', 'Category 2', 'Category 3'],
        values: [10, 20, 30],
    };
    const mockLineChartData = {
        gap_date: ['2023-01-01', '2023-02-01', '2023-03-01'],
        total_score: [400, 450, 500],
    };
    const original = console.error
    
    beforeAll(()=> {
        jest.spyOn(console,"error").mockImplementation(()=> {});

    });

    beforeEach(() => {
        console.error = jest.fn()
        // Mock the overall scores API response
        axios.get.mockResolvedValueOnce({
            data: mockOverallScores,
        });

    // Mock the bar chart data API response
    const originalFetch = global.fetch;
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockBarChartData),
            })
        )
      .mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockLineChartData),
            })
        )
      .mockImplementation(() => originalFetch.apply(this, arguments));
});

    afterEach(() => {
        jest.clearAllMocks();
        console.error.mockClear();
        console.error = original;
    });

    test('renders the component and fetches data', async () => {
        render(
            <MemoryRouter initialEntries={['/overall-output?company=TestCompany&gap_id=123']}>
                <OverallOutput />
            </MemoryRouter>
        );

        // Wait for the component to fetch and render data
        await waitFor(() => {
            // Check if the total score is rendered
            expect(screen.getByText('Total Score:')).toBeInTheDocument();
            expect(screen.getByText('450/600')).toBeInTheDocument();

            // Check if the percentages are rendered
            expect(screen.getByText('UNSATISFACTORY')).toBeInTheDocument();
            expect(screen.getByText('20% of Total Score')).toBeInTheDocument();

            expect(screen.getByText('NEEDS IMPROVEMENT')).toBeInTheDocument();
            expect(screen.getByText('30% of Total Score')).toBeInTheDocument();

            expect(screen.getByText('BASIC COMPLIANCE')).toBeInTheDocument();
            expect(screen.getByText('50% of Total Score')).toBeInTheDocument();

            // Check if the charts are rendered
            expect(screen.getByText('Mocked LineChart')).toBeInTheDocument();
            expect(screen.getByText('Mocked BarChart')).toBeInTheDocument();
        });
    });

    test('logs an error when API request fails', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error
        axios.get.mockRejectedValueOnce(new Error('Failed to fetch data')); 
        render(
            <MemoryRouter initialEntries={['/overall-output?company=TestCompany&gap_id=123']}>
                <OverallOutput />
            </MemoryRouter>
        );
        await waitFor(() => {
            if (!consoleErrorSpy.mock.calls.length) {
                console.log('console.error has not been called yet');
            }
            // make sure console.error was called
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Error fetching categories:',
                expect.any(Error)
            );
        });
        consoleErrorSpy.mockRestore(); 
    });

    test('does not fetch data when gapId is missing', async () => {
        render(
            <MemoryRouter initialEntries={['/overall-output?company=TestCompany']}>
                <OverallOutput />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(axios.get).not.toHaveBeenCalled(); // make sure API is not be called
        });
    });

});