import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import RegistedCompany from '../components/RegistedCompany';

// Mock axios
jest.mock('axios');

// Mock NavBar
jest.mock('../components/NavBar.js', () => () => <div>Mocked NavBar</div>);

// Mock charts 
jest.mock('../components/charts/BarChart.js', () => () => <div>Mocked BarChart</div>);
jest.mock('../components/charts/LineChart.js', () => () => <div>Mocked LineChart</div>);
jest.mock('../components/charts/LineChartWithBg.js', () => () => <div>Mocked LineChartWithBg</div>);

// Mock pdfDownload func
jest.mock('../components/PfPlan.js', () => ({
    pdfDownload: jest.fn(), 
}));

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
}));

describe('RegistedCompany Component', () => {
    const mockCompanyName = 'TestCompany';
    const mockGapId = '123';
    const mockCompanyNotes = 'Test company notes';
    const mockAnalyses = [
        { gap_id: 123, date: '2023-01-01', url: 'http://example.com' },
        { gap_id: 456, date: '2022-12-01', url: 'http://example.com/old' },
    ];
    const mockBarChartData = {
        categories: ['Category 1', 'Category 2'],
        values: [10, 20],
    };
    const mockLineChartData = {
        gap_date: ['2023-01-01', '2023-02-01'],
        total_score: [400, 450],
    };
    const mockLineBgData = {
        categories: ['Category 1', 'Category 2'],
        values: [10, 20],
    };   

    beforeEach(() => {
        // Mock useLocation to return the expected search string
        useLocation.mockReturnValue({
            search: `?company=${mockCompanyName}&gap_id=${mockGapId}`,
        });

        // Mock useNavigate
        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);

        // Mock fetch for company notes
        global.fetch = jest.fn((url) => {
            if (url.includes('/api/companies/')) {
                const urlObj = new URL(url, 'http://localhost');
                const companyName = urlObj.searchParams.get('name')
                if (companyName === mockCompanyName) {
                    return Promise.resolve({
                        json: () => Promise.resolve([{ notes: mockCompanyNotes }]), // exist data
                    });
                }
                
                return Promise.resolve({
                    json: () => Promise.resolve([{notes: 'No additional notes.'}]), // no data
                });
            }
        
            if (url.includes('/api/past_analyses/')) {
                return Promise.resolve({
                    json: () => Promise.resolve({ past_analyses: mockAnalyses }), // return mock past analysis
                });
            }
            if (url.includes('/api/analysis/')) {
                if (url.includes('bar-chart-data')) {
                    return Promise.resolve({
                        json: () => Promise.resolve(mockBarChartData),
                    });
                }
                if (url.includes('total-score-over-time')) {
                    return Promise.resolve({
                        json: () => Promise.resolve(mockLineChartData),
                    });
                }
                if (url.includes('line-chart-with-background')) {
                    return Promise.resolve({
                        json: () => Promise.resolve(mockLineBgData),
                    });
                }
            }
            return Promise.reject(new Error('Unknown URL'));
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders the component, fetches data and graphs', async () => {
        render(
            <MemoryRouter initialEntries={[`/registed-company?company=${mockCompanyName}&gap_id=${mockGapId}`]}>
                <RegistedCompany />
            </MemoryRouter>
        );

        // Wait for the component to fetch and render data
        await waitFor(() => {
            // Check if the company name is rendered
            expect(screen.getByText(mockCompanyName)).toBeInTheDocument();

            // Check if the company notes are rendered
            expect(screen.getByText(mockCompanyNotes)).toBeInTheDocument();

            // Check if the past analyses are rendered
            const overviewElements = screen.getAllByText('Overview (2023-01-01)');
            expect(overviewElements.length).toBe(2); // make sure there are 2 elements (title and past gap analysis)
            expect(overviewElements[0]).toBeInTheDocument(); 
            expect(overviewElements[1]).toBeInTheDocument(); 

            expect(screen.getByText('2022-12-01')).toBeInTheDocument() //another past gap analysis

            // Check if the charts are rendered
            expect(screen.getByText('Mocked BarChart')).toBeInTheDocument();
            expect(screen.getByText('Mocked LineChart')).toBeInTheDocument();
            expect(screen.getByText('Mocked LineChartWithBg')).toBeInTheDocument();
        });
    });

    test('handle URL with no gap_id', async () => {
        const newCompanyName = 'NewCompanyWithoutData';
        // Mock useLocation to return URL with no gap_id
        useLocation.mockReturnValue({
            search: `?company=${newCompanyName}`,
        });
        render(
            <MemoryRouter initialEntries={[`/registed-company?company=${newCompanyName}`]}>
                <RegistedCompany />
            </MemoryRouter>
        );
        // Wait for the component to fetch and render data
        await waitFor(() => {
            // Check if the default title is rendered
            expect(screen.getByText(/Overview/i)).toBeInTheDocument();
            expect(screen.getAllByText(/no gap data available now/i))
        });
        expect(screen.queryByText(/View Full Analysis/i)).not.toBeInTheDocument();
    });

    test('handle fetch error', async () => {
        // Mock fetch to return an error
        global.fetch = jest.fn(() => Promise.reject(new Error('Failed to fetch data')));

        // Spy on console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        render(
            <MemoryRouter>
                <RegistedCompany />
            </MemoryRouter>
        );
        await waitFor(() => {
            // Check if the error is logged
            expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching data:", expect.any(Error));
        });
        // Clean up
        consoleErrorSpy.mockRestore();
    });

    test('navigate to OverallOutput page when button click', async () => {
        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);

        render(
            <MemoryRouter initialEntries={[`/registed-company?company=${mockCompanyName}&gap_id=${mockGapId}`]}>
                <RegistedCompany />
            </MemoryRouter>
        );
        await waitFor(() => {
            // Click the "View Full Analysis" button
            expect(screen.getByText('View Full Analysis')).toBeInTheDocument();
            fireEvent.click(screen.getByText('View Full Analysis'));
        });
        // Check if navigate was called with the correct URL
        expect(mockNavigate).toHaveBeenCalledWith(
            `/overall-output?company=${encodeURIComponent(mockCompanyName)}&gap_id=${encodeURIComponent(mockGapId)}`
        );
    });
    
    test('pdfDownload should not be called when data is incomplete', async () => {
        const { pdfDownload } = require('../components/PfPlan.js');
        // Mock useLocation to return URL with gap_id
        useLocation.mockReturnValue({
            search: `?company=${mockCompanyName}&gap_id=${mockGapId}`,
        });
        // Mock fetch to return incomplete data
        global.fetch = jest.fn((url) => {
            if (url.includes('/api/analysis/scores')) {
                return Promise.resolve({
                    json: () => Promise.resolve({}), // incomplete data
                });
            }
            return Promise.reject(new Error('Unknown URL'));
        });
        render(
            <MemoryRouter initialEntries={[`/registed-company?company=${mockCompanyName}&gap_id=${mockGapId}`]}>
                <RegistedCompany />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(screen.getByAltText('Download')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByAltText('Download'));
        await waitFor(() => {
            // Ensure pdfDownload is not called
            expect(pdfDownload).not.toHaveBeenCalled();
        });
    });
});