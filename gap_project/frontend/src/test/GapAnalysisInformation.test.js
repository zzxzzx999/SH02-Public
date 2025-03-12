import React from "react";
import { GapInformation } from "../components/GapAnalysisInformation.js";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

jest.mock('axios');
 
// Create a mock for useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
 
describe('GapInformation component', () => {
let mockNavigate;

    beforeEach(() => {
        jest.clearAllMocks();
        //window.history.pushState({}, "Test", "?company=TestCompany");
    });
    
    const renderComponent = () =>
        render(
            <BrowserRouter>
                <GapInformation />
            </BrowserRouter>
        );

    // Done
    test('renders new GAP information form with company name, consultant, company rep name & email, evidence URL & additional notes', () => {
        renderComponent();
        expect(screen.getByPlaceholderText(/Consultant/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Company Representative Name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Company Representative Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Gap Analysis Evidence URL/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Additional Notes/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create New GAP/i })).toBeInTheDocument();
    });

    test("displays company name from URL query", () => {
        window.history.pushState({}, "Test", "?company=TestCompany");
      
        renderComponent();
      
        expect(screen.getByText(/TestCompany/i)).toBeInTheDocument();
    });
      
    test("updates form fields on user input", () => {
        window.history.pushState({}, "Test", "?company=TestCompany");
        
        renderComponent();
        
        // Simulate typing in form fields
        fireEvent.change(screen.getByPlaceholderText(/Consultant/i), {
            target: { value: "John Doe" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Company Representative Name/i), {
            target: { value: "Jane Smith" },
        });
        
        // Check if the values are updated
        expect(screen.getByPlaceholderText(/Consultant/i).value).toBe("John Doe");
        expect(screen.getByPlaceholderText(/Company Representative Name/i).value).toBe("Jane Smith");
    });
      
    test("updates form fields on user input NEW", () => {
        renderComponent();
    
        const consultantInput = screen.getByPlaceholderText(/Consultant/i);
        fireEvent.change(consultantInput, { target: { value: "John Doe" } });
        expect(consultantInput.value).toBe("John Doe");
    
        const repInput = screen.getByPlaceholderText(/Company Representative Name/i);
        fireEvent.change(repInput, { target: { value: "Jane Smith" } });
        expect(repInput.value).toBe("Jane Smith");
    
        const emailInput = screen.getByPlaceholderText(/Company Representative Email/i);
        fireEvent.change(emailInput, { target: { value: "jane@example.com" } });
        expect(emailInput.value).toBe("jane@example.com");
    
        const urlInput = screen.getByPlaceholderText(/Gap Analysis Evidence URL/i);
        fireEvent.change(urlInput, { target: { value: "http://example.com" } });
        expect(urlInput.value).toBe("http://example.com");
    
        const notesInput = screen.getByPlaceholderText(/Additional Notes/i);
        fireEvent.change(notesInput, { target: { value: "Some additional notes" } });
        expect(notesInput.value).toBe("Some additional notes");
      });
    
    test('submits the form and navigates to the correct page', async () => {
        axios.post.mockResolvedValueOnce({}); // Simulate successful API response
        renderComponent();

        // Fill in form inputs
        fireEvent.change(screen.getByPlaceholderText(/Consultant/i), { target: { value: 'Test Consultant' } });
        fireEvent.change(screen.getByPlaceholderText(/Company Representative Name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText(/Company Representative Email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Gap Analysis Evidence URL/i), { target: { value: 'http://example.com' } });

        // Submit form
        fireEvent.click(screen.getByRole('button', { name: /Create New GAP/i }));

        // Ensure axios was called with correct data
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith("http://127.0.0.1:8000/api/create-gap/", expect.any(Object));
        });
    });
});