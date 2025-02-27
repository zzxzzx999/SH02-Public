import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import GapAnalysis from '../components/GapAnalysis';
import Elements from '../components/GapAnalysis';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react';

// mock axios to be able to simulate backend response
jest.mock('axios');

// use describe() for every component (so in this file, 3 describe() for each component)
describe('GapAnalysis component', () => {
    beforeAll(() => {
        // mock window.location.search to test url paramater passing
        delete window.location;
        window.location = { search: '?company=gordonfoley' };
    });
    // clear localStorage and mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    // mock the backend response (which sends the gapID)
    const mockBackendResponse = {
        data: {
            gap_id: '123',
        },
    };

    // Create a mock for useNavigate
    const mockedUsedNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockedUsedNavigate,
        useSearchParams: () => [new URLSearchParams('gordonfoley')],
    }));

    // renders the component inside the BrowserRouter
    const renderComponent = () => {
        render(
            <BrowserRouter>
                <GapAnalysis />
            </BrowserRouter>
        );
    };

    test('stores gapID in localStorage after fetching data from the backend', async () => {
        // mock axios.get to simulate the backend call
        axios.get.mockResolvedValue(mockBackendResponse);

        renderComponent();

        // wait for the component to fetch data from the backend and set the gapID in localStorage
        await waitFor(() => {
            // check if the gapID was stored in localStorage after the backend call
            const gapID = localStorage.getItem('gapID');
            expect(gapID).toBe('123');
        });
    });

    test('stores companyName in localStorage after getting it from the URL', async () => {
        axios.get.mockResolvedValue(mockBackendResponse);

        renderComponent();

        // wait for the component to fetch data from the backend and set the gapID in localStorage
        await waitFor(() => {
            // check if the gapID was stored in localStorage after the backend call
            const gapID = localStorage.getItem('gapID');
            expect(gapID).toBe('123');
        });

        // wait for the component to fetch data from the backend and set the gapID in localStorage
        await waitFor(() => {
            // check if the gapID was stored in localStorage after the backend call
            const companyName = localStorage.getItem('companyName');
            expect(companyName).toBe('gordonfoley');
        });
    })

    test('gap analysis introduction information renders', async () => {
        axios.get.mockResolvedValue(mockBackendResponse);

        renderComponent();

        // wait for the component to fetch data from the backend and set the gapID in localStorage
        await waitFor(() => {
            // check if the gapID was stored in localStorage after the backend call
            const gapID = localStorage.getItem('gapID');
            expect(gapID).toBe('123');
        });

        await waitFor(() => {
            const benchmarkingTitle = screen.getByRole('heading', { level: 2, name: /Benchmarking/i });
            expect(benchmarkingTitle).toBeInTheDocument();

            // check if content inside the Benchmarking section has rendered
            const benchmarkingText = screen.getByText(
                /The Gap Analysis benchmarks the organization against Gordon Foley’s ‘best in class’ standards/i
            );
            expect(benchmarkingText).toBeInTheDocument();
        });

        // check if Purpose section is rendered
        await waitFor(() => {
            // check if Purpose section is rendered
            const purposeTitle = screen.getByRole('heading', { level: 2, name: /Purpose/i });
            expect(purposeTitle).toBeInTheDocument();

            const purposeText1 = screen.getByText(
                /The Gap Analysis tool identifies an organization’s current status in health and safety management./i
            );
            expect(purposeText1).toBeInTheDocument();

            const purposeText2 = screen.getByText(
                /The Gap Analysis applies a set of questions which cover the general scope of a health and safety management system./i
            );
            expect(purposeText2).toBeInTheDocument();
        });
    });

    // if gapID hasnt been sent from backend properly, should be an error
    test('displays error when no gapID is returned', async () => {
        // simulate no gap ID sent
        axios.get.mockResolvedValue({ data: {} });

        renderComponent();

        // wait for the component to fetch data and render the error message
        await waitFor(() => {
            const errorMessage = screen.getByText(/Unable to retrieve gapID./i);
            expect(errorMessage).toBeInTheDocument();
        });
    });

    // Test for when 'company' is missing in the URL
});

describe('Elements component', () => {
    beforeAll(() => {
        // mock window.location.search to test url paramater passing
        delete window.location;
        window.location = { search: '?company=gordonfoley' };
    });
    // clear localStorage and mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    // mock the backend response (which sends the gapID)
    const mockBackendResponse = {
        data: {
            gap_id: '123',
        },
    };

    // Create a mock for useNavigate
    const mockedUsedNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockedUsedNavigate,
        useSearchParams: () => [new URLSearchParams('company=gordonfoley')],
    }));

    // renders the component inside the BrowserRouter
    const renderComponent = () => {
        render(
            <BrowserRouter>
                <Elements />
            </BrowserRouter>
        );
    };

    test('stores companyName in localStorage after getting it from the URL', async () => {
        axios.get.mockResolvedValue(mockBackendResponse);

        renderComponent();

        // wait for the component to fetch data from the backend and set the gapID in localStorage
        await waitFor(() => {
            // check if the gapID was stored in localStorage after the backend call
            const gapID = localStorage.getItem('gapID');
            expect(gapID).toBe('123');
        });

        // wait for the component to fetch data from the backend and set the gapID in localStorage
        await waitFor(() => {
            // check if the gapID was stored in localStorage after the backend call
            const companyName = localStorage.getItem('companyName');
            expect(companyName).toBe('gordonfoley');
        });
    })

    test('question 1.1 renders if element 0 is read from the URL', async () => {
        axios.get.mockResolvedValue(mockBackendResponse);

        renderComponent();

        // wait for the component to fetch data from the backend and set the gapID in localStorage
        await waitFor(() => {
            // check if the gapID was stored in localStorage after the backend call
            const gapID = localStorage.getItem('gapID');
            expect(gapID).toBe('123');
        });

        const mockLocation = {
            search: '?company=gordonfoley&element=0'
        };
        jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue(mockLocation);

        // wait for the component to fetch data from the backend and set the gapID in localStorage
        await waitFor(() => {
    
            // Check if the question name is rendered correctly
            const questionName = screen.getByText(/The organisation has a valid written health and safety policy/);
            expect(questionName).toBeInTheDocument();
        });
    })
});
