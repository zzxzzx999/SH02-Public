import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AboutUs from "../components/Home.js";
import { BrowserRouter } from "react-router-dom";

// Mock API URL
const mockUrl = "http://127.0.0.1:8000/api/companies/?name=";

// Mock Fetch API (So no real API call is made, can be controlled and monitored)
global.fetch = jest.fn();

const renderComponent = () =>
  render(
    <BrowserRouter>
      <AboutUs />
    </BrowserRouter>
  );

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Home page correctly", () => {
    renderComponent();

    expect(screen.getByText(/Gordon Foley Consulting/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search for company/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Clear Results/i })).toBeInTheDocument();
    expect(screen.getByText(/About Us/i)).toBeInTheDocument(); // Omiting the rest of the text
  });

  test("search & display existing companies and display resume/start new gap analysis", async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue([
        { name: "Company A", current_gap: true },
        { name: "Company B", current_gap: false },
      ]),
    });

    renderComponent();

    const searchBox = screen.getByPlaceholderText(/Search for company/i);
    fireEvent.change(searchBox, { target: { value: "Company" } });
    fireEvent.keyDown(searchBox, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(mockUrl + "Company", { method: "GET" });
      expect(screen.getByText(/Company A/i)).toBeInTheDocument();
      expect(screen.getByText(/Company B/i)).toBeInTheDocument();
    });

    // Check if correct links are generated
    expect(screen.getByText(/Resume GAP Analysis/i)).toHaveAttribute(
      "href",
      "/gap-analysis?company=Company A" //resume gap analysis
    );
    expect(screen.getByText(/Start GAP Analysis/i)).toHaveAttribute(
      "href",
      "/new-gap-confirm?company=Company B" //start gap analysis
    );
  });

  test("clears search results when Clear Results button is clicked", async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue([{ name: "Company C", current_gap: false }]),
    });

    renderComponent();

    const searchBox = screen.getByPlaceholderText(/Search for company/i);
    fireEvent.change(searchBox, { target: { value: "Company C" } });
    fireEvent.keyDown(searchBox, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(screen.getByText(/Company C/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Clear Results/i }));

    expect(screen.queryByText(/Company C/i)).not.toBeInTheDocument();
  });

  test("shows 'No companies found' when search returns no results", async () => {
    fetch.mockResolvedValueOnce({ json: jest.fn().mockResolvedValue([]) });

    renderComponent();

    const searchBox = screen.getByPlaceholderText(/Search for company/i);
    fireEvent.change(searchBox, { target: { value: "Unknown Company" } });
    fireEvent.keyDown(searchBox, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(screen.getByText(/No companies found/i)).toBeInTheDocument();
    });
  });
});
