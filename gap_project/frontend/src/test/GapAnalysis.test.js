import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import GapAnalysis from '../components/GapAnalysis';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

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
        useSearchParams: () => [new URLSearchParams('company=gordonfoley')],
    }));

    // renders the component inside the BrowserRouter
    const renderComponent = () =>
        render(
            <BrowserRouter>
                <GapAnalysis />
            </BrowserRouter>
        );

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
            const errorMessage = screen.getByText(/No Gap ID available/i);
            expect(errorMessage).toBeInTheDocument();
        });
    });

    // when company could not be retrieved from the url
    test('displays error when company not retrieved from url', async () => {
        renderComponent();
        
        await waitFor(() => {
            const errorMessage = screen.getByText(/Error fetching gap analysis ID. Company name is not valid./i); 
            expect(errorMessage).toBeInTheDocument();
        });
    });
    
});
