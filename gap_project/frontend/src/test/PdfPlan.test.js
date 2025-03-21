import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import PdfPlan, { pdfDownload } from "../components/PfPlan.js";

jest.mock("axios");

describe("pdfDownload function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("makes API calls and downloads PDF on success", async () => {
    const mockPostResponse = { status: 200, data: "POST SUCCESS" };
    const mockPdfResponse = { data: new Blob(["PDF content"], { type: "application/pdf" }) };

    axios.post.mockResolvedValueOnce(mockPostResponse);
    axios.get.mockResolvedValueOnce(mockPdfResponse);

    const gapID = "123";
    const PDFTitle = "TestReport";

    // Mock `createObjectURL`
    global.URL.createObjectURL = jest.fn(() => "mock-url");
    const mockClick = jest.spyOn(document, "createElement");

    await pdfDownload(gapID, PDFTitle);

    expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/gap/pdfplan/", {
      key1: "BOOOOOOOOO",
      id: gapID,
    });

    expect(axios.get).toHaveBeenCalledWith("http://localhost:8000/gap/pdfplan/", {
      responseType: "blob",
    });

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();

    // Cleanup
    mockClick.mockRestore();
  });

  test("handles API errors gracefully", async () => {
    axios.post.mockRejectedValueOnce(new Error("Post Request Failed"));

    await pdfDownload("123", "TestReport");

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.get).not.toHaveBeenCalled();
  });
});

describe("PdfPlan Component", () => {
  test("renders button and triggers pdfDownload on click", async () => {
    render(<PdfPlan />);
    const button = screen.getByText(/Download .pdf file/i);

    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });
});
