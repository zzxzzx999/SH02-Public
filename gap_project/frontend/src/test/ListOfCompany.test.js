import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from 'axios';
import React from 'react';
import { MemoryRouter } from "react-router-dom";
import ListofCompany from "../components/ListofCompany";

// Mock axios
jest.mock('axios');

// Mock API URLs to match the ones in the component
const mockPastAnalysisUrl = "http://localhost:8000/api/past_analyses/";
const mockCompanyLatestTotalScoreUrl = "http://localhost:8000/api/company-latest-total-score/";
const mockDeleteCompanyUrl = "http://localhost:8000/api/companies/";

// Mock Fetch API (So no real API call is made, can be controlled and monitored)
global.fetch = jest.fn();

// Mock NavBar component
jest.mock('../components/NavBar.js', () => () => <div>Mocked NavBar</div>);

describe('ListOfCompany Component', () => {
    const mockCompanies = [
        { name: 'company A', score:400, dateRegistered: '2016-05-23' },
        { name: "company B", score:350,  dateRegistered: '2014-11-02' },
    ];

    const mockScores = {
        'company%20A': 400,
        'company%20B': 350,
    };

    beforeEach(() => {
        // Mock axios to return company data
        axios.get.mockResolvedValueOnce({
            data: mockCompanies,
        });
        
        global.fetch = jest.fn((url) => {
            //  the score request
            if (url.includes(mockCompanyLatestTotalScoreUrl)) {
                const encodedName = url.split('/').pop();
                return Promise.resolve({
                    json: () => Promise.resolve({ score: mockScores[encodedName] })
                });
            }
            // gap analysis request
            if (url.includes("/past_analyses/")) {
                return Promise.resolve({
                    json: () => Promise.resolve({ past_analyses: [] })
                });
            }
            return Promise.reject(new Error(mockPastAnalysisUrl));
        });

        render(
            <MemoryRouter>
                <ListofCompany />
            </MemoryRouter>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders the component and fetches companies', async () => {
        // Wait for companies to be fetched and rendered
        await waitFor(() => {
            expect(screen.getByText('company A')).toBeInTheDocument();
            expect(screen.getByText("company B")).toBeInTheDocument();
        });
        // check axios mock data is return correctly
        expect(axios.get).toHaveBeenCalledTimes(1);
        // check fetch mock data is return correctly
        const fetchCalls = global.fetch.mock.calls;
        // Wait for scores to be fetched and rendered
        await waitFor(() => {
            expect(screen.getByText('378')).toBeInTheDocument();
            expect(screen.getByText('359')).toBeInTheDocument();
            const expectedDate = new Date('2016-05-23').toLocaleDateString();
            expect(screen.getByText(expectedDate)).toBeInTheDocument();
        });
    });

    test('search company in searchbar', async () => {
        // Wait for companies to be rendered
        await waitFor(() => {
            expect(screen.getByText('company A')).toBeInTheDocument();
        });

        // Type in the search input
        const searchInput = screen.getByPlaceholderText('Search Company List');
        fireEvent.change(searchInput, { target: { value: 'company a' } });

        // Wait for search results to be filtered
        await waitFor(() => {
            expect(screen.getByText('company A')).toBeInTheDocument();
            expect(screen.queryByText("company B")).toBeNull();
        });
    });

    test("filters companies correctly", async () => {
        // Wait for companies to be rendered
        await waitFor(() => {
            expect(screen.getByText("company A")).toBeInTheDocument();
        });
        // Click the filter button
        const filterButton = screen.getByText("Filter");
        fireEvent.click(filterButton);
        // Click the "Already Analysis" option
        await act(async () => {
            const alreadyAnalysisOption = screen.getByText("Already Analysis");
            fireEvent.click(alreadyAnalysisOption);
        });
        // Wait for companies to be filtered
        await waitFor(() => {
            const companyA = screen.queryByText("company A");
            const companyB = screen.queryByText("company B");
            if (companyA) {
                expect(companyA).toBeInTheDocument();
            }
            if (companyB) {
                expect(companyB).toBeInTheDocument();
            }
        });

    });

    test('sort company by score high to low', async () => {
        // Wait for companies to be rendered
        await waitFor(() => {
            expect(screen.getByText('company A')).toBeInTheDocument();
        });

        // Click the sort button and select "Score High to Low"
        const sortButton = screen.getByText('Sort');
        fireEvent.click(sortButton);
        const sortOption = screen.getByText('Score High to Low');
        fireEvent.click(sortOption);

        // Wait for companies to be sorted
        await waitFor(() => {
            const companyLinks = screen.getAllByRole('link');
            const companyNames = companyLinks.map((link) => link.textContent);
            expect(companyNames[0]).toBe('company A'); // company A has the highest score
            expect(companyNames[1]).toBe("company B"); // company B has the lower score
        });
    });

    test('sort company by date latest to earliest', async () => {
        // Wait for companies to be rendered
        await waitFor(() => {
            expect(screen.getByText('company A')).toBeInTheDocument();
        });

        // Click the sort button and select "Latest Registered"
        const sortButton = screen.getByText('Sort');
        fireEvent.click(sortButton);
        const sortOption = screen.getByText(/Latest Registered/i);
        fireEvent.click(sortOption);

        // Wait for companies to be sorted
        await waitFor(() => {
            const companyLinks = screen.getAllByRole('link');
            const companyNames = companyLinks.map((link) => link.textContent);
            expect(companyNames[0]).toBe('company A'); // company A is the latest registered
            expect(companyNames[1]).toBe("company B"); // company B is the earlier registered
        });
    });

    test('show delete pop up when clicking delete button', async () => {
        // Wait for companies to be rendered
        await waitFor(() => {
            expect(screen.getByText('company A')).toBeInTheDocument();
            const deleteButton = screen.getAllByText(/Delete/i);
            expect(deleteButton.length).toBeGreaterThan(0); // Ensure at least one Delete button
        });

        // Click the delete button for Company A
        const deleteButton = screen.getAllByText(/Delete/i)[0];
        fireEvent.click(deleteButton);

        // Wait for the popup to be shown
        await waitFor(() => {
            expect(screen.getByText('Notice!')).toBeInTheDocument();
            expect(screen.getByText("Are you sure you want to delete 'company A'?")).toBeInTheDocument();
        });
    });

    test('delete company after confirm delete', async () => {
        // Wait for companies to be rendered
        await waitFor(() => {
            expect(screen.getByText('company A')).toBeInTheDocument();
        });

        // Mock the delete API response
        axios.delete.mockResolvedValueOnce({});
        axios.delete.mockImplementation((url) => {
            if (url.startsWith(mockDeleteCompanyUrl)) {
                return Promise.resolve({});
            }
            return Promise.reject(new Error('Unexpected URL'));
        });

        // Click the delete button for Company A
        const deleteButton = screen.getAllByText(/Delete/i)[0];
        fireEvent.click(deleteButton);

        // Wait for the popup to be shown
        await waitFor(() => {
            expect(screen.getByText('Notice!')).toBeInTheDocument();
        });

        // Click the "Yes" button in the popup
        const confirmButton = screen.getByText('Yes');
        fireEvent.click(confirmButton);

        // Wait for Company A to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText('company A')).toBeNull();
        });
    });
});