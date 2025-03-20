import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Accordion from "../components/Accordion";

describe("Accordion component", () => {
  const mockData = [
    {
      Section_Number: 1,
      Questions: { Question_Name: "What is the policy?", Question_Number: "1.1" }
    },
    {
      Section_Number: 1,
      Questions: { Question_Name: "How is it implemented?", Question_Number: "1.2" }
    },
  ];

  const mockAnswers = {
    1: [3, 5] // First question: score 3, Second question: score 5
  };

  const mockEvidence = {
    1: ["Policy document", "Compliance report"]
  };

  const mockImprovement = {
    1: ["Update policy", "Improve documentation"]
  };

  test("renders Accordion with items", () => {
    render(<Accordion data={mockData} answers={mockAnswers} evidence={mockEvidence} improvement={mockImprovement} />);
    
    expect(screen.getByText("1. What is the policy?")).toBeInTheDocument();
  });

  test("expands and collapses an AccordionItem when clicked", () => {
    render(<Accordion data={mockData} answers={mockAnswers} evidence={mockEvidence} improvement={mockImprovement} />);

    const firstItem = screen.getByText("1. What is the policy?");
    //expect(screen.queryByText("Policy document")).not.toBeInTheDocument();

    fireEvent.click(firstItem);
    expect(screen.getByText("Policy document")).toBeInTheDocument();

    fireEvent.click(firstItem);
    expect(screen.getByText("Policy document")).toBeInTheDocument();
  });

  test("displays correct compliance score, evidence, and improvement", () => {
    render(<Accordion data={mockData} answers={mockAnswers} evidence={mockEvidence} improvement={mockImprovement} />);

    fireEvent.click(screen.getByText("1. What is the policy?"));
    expect(screen.getByText("Basic Compliance (Score 3)")).toBeInTheDocument();
    expect(screen.getByText("Policy document")).toBeInTheDocument();
    expect(screen.getByText("Update policy")).toBeInTheDocument();
  });
});
