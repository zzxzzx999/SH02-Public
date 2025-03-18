import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NewCompany from "../components/NewCompany.js";
import axios from "axios";

jest.mock("axios");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("NewCompany component", () => {
    beforeEach(() => {
        global.console = {
        ...global.console,
        error: jest.fn(),
        };
    });
    
    afterEach(() => {
        jest.restoreAllMocks();
    });

    const renderComponent = (userRole) => {
        localStorage.setItem("userRole", userRole);
        render(
        <BrowserRouter>
            <NewCompany />
        </BrowserRouter>
        );
    };

    test("renders form with company name and additional notes fields", () => {
        renderComponent("admin");

        expect(screen.getByPlaceholderText(/Company Name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Additional Notes/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Create New Company/i })).toBeInTheDocument();
    });

    test("updates form fields on user input", () => {
        renderComponent("admin");

        const companyNameInput = screen.getByPlaceholderText(/Company Name/i);
        const additionalNotesInput = screen.getByPlaceholderText(/Additional Notes/i);

        fireEvent.change(companyNameInput, { target: { value: "Test Company" } });
        fireEvent.change(additionalNotesInput, { target: { value: "Test Notes" } });

        expect(companyNameInput.value).toBe("Test Company");
        expect(additionalNotesInput.value).toBe("Test Notes");
    });

    test("submits form and navigates to /list-of-companies for admin", async () => {
        renderComponent("admin");

        axios.post.mockResolvedValueOnce({}); // Mock successful API call

        fireEvent.change(screen.getByPlaceholderText(/Company Name/i), {
        target: { value: "Test Company" },
        });
        fireEvent.click(screen.getByRole("button", { name: /Create New Company/i }));

        await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/list-of-companies"));
    });

    test("submits form and navigates to new-gap-confirm for non-admin", async () => {
        renderComponent("client");

        axios.post.mockResolvedValueOnce({}); // Mock successful API call

        fireEvent.change(screen.getByPlaceholderText(/Company Name/i), {
        target: { value: "Client Company" },
        });
        fireEvent.click(screen.getByRole("button", { name: /Create New GAP/i }));

        await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith("/new-gap-confirm?company=Client%20Company")
        );
    });

    test("prevents form submission when required fields are empty", async () => {
        renderComponent("admin");
      
        fireEvent.click(screen.getByRole("button", { name: /Create New Company/i }));
      
        await waitFor(() => {
          expect(screen.getByPlaceholderText(/Company Name/i)).toBeInvalid();
        });
      });
});
