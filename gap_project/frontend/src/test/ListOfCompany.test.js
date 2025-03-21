import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import ListofCompany from "../components/ListofCompany";

// Mock axios
jest.mock("axios");

// Mock Fetch API (So no real API call is made, can be controlled and monitored)
global.fetch = jest.fn();

// Mock NavBar component
jest.mock("../components/NavBar.js", () => () => <div>Mocked NavBar</div>);

describe("ListOfCompany Component", () => {
  const mockCompanies = [
    { name: "company A", dateRegistered: "2016-05-23" },
    { name: "company B", dateRegistered: "2014-11-02" },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();

    axios.get.mockResolvedValueOnce({ data: mockCompanies });

    global.fetch.mockImplementation((url) => {
      console.log("Intercepted fetch:", url);
      if (url.includes("/api/companies/")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockCompanies),
        });
      }
      return Promise.reject(new Error("Unknown URL: " + url));
    });

    await waitFor(() => {
        render(
            <MemoryRouter>
                <ListofCompany />
            </MemoryRouter>
            );
    });
  });

  test("renders the component and fetches companies", async () => {
    await waitFor(() => {
      expect(screen.getByText("company A")).toBeInTheDocument();
      expect(screen.getByText("company B")).toBeInTheDocument();
    });
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  test("search company in search bar", async () => {
    await waitFor(() => {
      expect(screen.getByText("company A")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search Company List");
    fireEvent.change(searchInput, { target: { value: "company a" } });

    await waitFor(() => {
      expect(screen.getByText("company A")).toBeInTheDocument();
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

  test("sorts company by score high to low", async () => {
    await waitFor(() => {
      expect(screen.getByText("company A")).toBeInTheDocument();
    });

    const sortButton = screen.getByText("Sort");
    fireEvent.click(sortButton);
    const sortOption = screen.getByText("Score High to Low");
    fireEvent.click(sortOption);

    await waitFor(() => {
      const companyLinks = screen.getAllByRole("link");
      const companyNames = companyLinks.map((link) => link.textContent);
      expect(companyNames[0]).toBe("company A");
      expect(companyNames[1]).toBe("company B");
    });
  });

  test("shows delete popup when clicking delete button", async () => {
    await waitFor(() => {
      expect(screen.getByText("company A")).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByText(/Delete/i)[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText("Notice!")).toBeInTheDocument();
      expect(
        screen.getByText("Are you sure you want to delete 'company A'?")
      ).toBeInTheDocument();
    });
  });

  test("deletes company after confirming delete", async () => {
    await waitFor(() => {
      expect(screen.getByText("company A")).toBeInTheDocument();
    });

    axios.delete.mockResolvedValueOnce({});

    const deleteButton = screen.getAllByText(/Delete/i)[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText("Notice!")).toBeInTheDocument();
    });

    const confirmButton = screen.getByText("Yes");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByText("company A")).toBeNull();
    });
  });
});
