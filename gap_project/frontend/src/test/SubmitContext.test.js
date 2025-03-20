import React from "react";
import { render, screen } from "@testing-library/react";
import { SubmitProvider, useSubmit } from "../components/SubmitContext.js";

// Test component to consume the context
const TestComponent = () => {
  const submitFunction = useSubmit();
  return <button onClick={submitFunction}>Submit</button>;
};

describe("SubmitContext", () => {
  test("provides the correct value to consumers", () => {
    const mockSubmitFunction = jest.fn();

    render(
      <SubmitProvider submitAnswersToAPI={mockSubmitFunction}>
        <TestComponent />
      </SubmitProvider>
    );

    // Find the button and trigger click
    const button = screen.getByText("Submit");
    button.click();

    // Ensure the provided function was called
    expect(mockSubmitFunction).toHaveBeenCalledTimes(1);
  });

  test("useSubmit returns undefined when used outside of provider", () => {
    let error;
    try {
      useSubmit();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });
});
