import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from 'axios';
import React from 'react';
import { MemoryRouter } from "react-router-dom";
import ListofCompany from "../components/ListofCompany";

// Mock axios
jest.mock('axios');

// Mock NavBar component
jest.mock('../components/NavBar.js', () => () => <div>Mocked NavBar</div>);

describe ('ListOfCompany Component', () => {
    const mockCompanies = [
        { name: 'Resolve Merge', dateRegistered: '2016-05-23' },
        { name: "Joe's Plumming Ltd", dateRegistered: '2014-11-02' },
        { name: 'Resolution Today', dateRegistered: '2014-03-08' },
    ];

    const mockScores = {
        'Resolve Merge': 378,
        "Joe's Plumming Ltd": 359,
        'Resolution Today': 355,
    };

    beforeEach(() => {
        // Mock the companies API response
        axios.get.mockResolvedValueOnce({
          data: mockCompanies,
        });
    
        // Mock the scores API response
        axios.get.mockResolvedValueOnce({
          data: { score: 378},
        });
    
        axios.get.mockResolvedValueOnce({
          data: { score: 359 },
        });

        // Render the component before each test
        render(
            <MemoryRouter>
                <ListofCompany/>
            </MemoryRouter>
        );
      });
    
    afterEach(() => {
        jest.clearAllMocks();
      });
    
    it('renders the component and fetches companies', async () => {
        // Wait for companies to be fetched and rendered
        await waitFor(() => {
            expect(screen.getByText('Resolve Merge')).toBeInTheDocument();
            expect(screen.getByText("Joe's Plumming Ltd")).toBeInTheDocument();
            expect(screen.getByText('378')).toBeInTheDocument();
            expect(screen.getByText('359')).toBeInTheDocument();
            expect(screen.getByText(/2016[/-]05[/-]23/)).toBeInTheDocument();
            expect(screen.getByText(/2016[/-]11[/-]02/)).toBeInTheDocument();
        });
    });

    it ('search company in searchbar', async() =>{
        // Wait for companies to be rendered
        await waitFor(() => {
            expect(screen.getByText('Resolve Merge')).toBeInTheDocument();
        });
        // Type in the search input
        const searchInput = screen.getByPlaceholderText('Search Company List');
        fireEvent.change(searchInput, {target:{value:'resolve'}});
        await waitFor (()=>{
            expect(screen.getByText('Resolve Merge')).toBeInTheDocument();
            expect(screen.queryByText("Joe's Plumming Ltd")).toBeNull();
        });
    });

    it('filter companys', async() =>{
        // Wait for companies to be rendered
        await waitFor(() => {
            expect(screen.getByText('Resolve Merge')).toBeInTheDocument();
        });
        // Click the filter button 
        const filterButton = screen.getByText('Filter');
        fireEvent.click(filterButton);
        //test already analysis button
        const option = screen.getByText('Already Analysis');
        fireEvent.click(option);
        await waitFor (() => {
            expect(screen.getByText('Resolve Merge')).toBeInTheDocument();
            expect(screen.getByText("Joe's Plumming Ltd")).toBeInTheDocument();
        })
        // test no gap analysis button 
        fireEvent.click(filterButton);
        const noAnalysisOption = screen.getByText('No GAP Analysis');
        fireEvent.click(noAnalysisOption);
        await waitFor (()=>{
            expect(screen.queryByText("Joe's Plumming Ltd")).toBeNull();
            expect(screen.queryByText('Resolve Merge')).toBeNull();
        });
    });

    it('sort company by score high to low', async()=>{
        // Wait for companies to be rendered
        await waitFor(() => {
            expect(screen.getByText('Resolve Merge')).toBeInTheDocument();
        });
        // Click the sort button and select "Score High to Low"
        const sortButton = screen.getByText('Sort');
        fireEvent.click(sortButton);
        const sortOption = screen.getByText('Score High to Low');
        fireEvent.click(sortOption);
        await waitFor(() => {
            const companyLinks = screen.getAllByRole('link'); // use it to choose the content in the link
            const companyNames = companyLinks.map((link) => link.textContent);
            expect(companyNames[0]).toBe('Resolve Merge'); 
            expect(companyNames[1]).toBe("Joe's Plumming Ltd");
        });
    });

    it('sort company by date latest to earliest', async()=>{
        // Wait for companies to be rendered
        await waitFor(() => {
            expect(screen.getByText('Resolve Merge')).toBeInTheDocument();
        });
        // Click the sort button and select "Latest Regietered"
        const sortButton = screen.getByText('Sort');
        fireEvent.click(sortButton);
        const sortOption = screen.getByText(/Latest Registered/i);
        fireEvent.click(sortOption);
        // Check if companies are sorted correctly
        await waitFor(() => {
            const companyLinks = screen.getAllByRole('link'); 
            const companyNames = companyLinks.map((link) => link.textContent);
            expect(companyNames[0]).toBe('Resolve Merge'); 
            expect(companyNames[1]).toBe("Joe's Plumming Ltd");
        });
    });

    it('show delete pop up when clicking delete button', async()=>{
        // Wait for companies to be rendered
        await waitFor(() => {
            expect(screen.getByText('Resolve Merge')).toBeInTheDocument();
            const deleteButton = screen.getAllByText(/Delete/i); // 使用正则表达式匹配
            expect(deleteButton.length).toBeGreaterThan(0); // 确保至少有一个 Delete 按钮
        });
        // Click the delete button for Company A
        const deleteButton = screen.getAllByText(/Delete/i)[0];
        fireEvent.click(deleteButton);
        // Check if the popup is shown
        await waitFor (()=>{
            expect(screen.getByText('Notice!')).toBeInTheDocument();
            expect(screen.getByText("Are you sure you want to delete 'Resolve Merge'?")).toBeInTheDocument();
        });
    });

    it('delete company after comfire delete', async()=>{
        // Mock the delete API response
        axios.delete.mockResolvedValueOnce({});
        // Click the delete button for Company A
        const deleteButton = screen.getByText(/Delete/i);
        fireEvent.click(deleteButtons[0]);
        // Click the "Yes" button in the popup
        const confirmButton = screen.getByText('Yes');
        fireEvent.click(confirmButton);
        await waitFor(() => {
            expect(screen.queryByText('Resolve Merge')).toBeNull();
        });
    });
})