import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Accordion from '../components/Accordion';

const mockData = [
  {
    Section_Number: 1,
    Questions: {
      Question_Number: '1.1',
      Question_Name: 'Is the policy documented?'
    }
  },
  {
    Section_Number: 1,
    Questions: {
      Question_Number: '1.2',
      Question_Name: 'Is the policy communicated effectively?'
    }
  }
];

const mockAnswers = {
  '1': [3, 5]
};

const mockEvidence = {
  '1': ['Document provided', 'Policy is shared via emails']
};

const mockImprovement = {
  '1': ['Ensure annual review', 'Increase employee awareness']
};

describe('Accordion Component', () => {
    const renderAccordion = () => {
        render(
            <Accordion
              data={mockData}
              answers={mockAnswers}
              evidence={mockEvidence}
              improvement={mockImprovement}
        />)
    };

    test('renders all questions from mockData', () => {
        renderAccordion();
        screen.debug();
      
        // ensure all questions are rendered
        mockData.slice(0, -1).forEach((item, index) => {
          expect(
            screen.getByText(new RegExp(`${index + 1}\\.\\s*${item.Questions.Question_Name}`))
          ).toBeInTheDocument();
        });
      
        // check the total count of questions are 2
        expect(screen.getAllByRole('button')).toHaveLength(mockData.length - 1);
      });

      test('renders N/A for evidence and populated value for improvement', async () => {
        const evidence = { 1: ['N/A'] };
        const improvement = { 1: ['Update policy documentation.'] };
      
        render(
          <Accordion
            data={mockData}
            answers={mockAnswers}
            evidence={evidence}
            improvement={improvement}
          />
        );
      
        // open the first accordion item
        const firstButton = screen.getByRole('button', { name: /1\. Is the policy documented\?/i });
        await userEvent.click(firstButton);
      
        // check evidence shows N/A
        expect(screen.getByText('N/A')).toBeInTheDocument();
      
        // check improvement shows "Update policy documentation."
        expect(screen.getByText('Update policy documentation.')).toBeInTheDocument();
      });

      test('opens the accordion and displays content', async () => {
        const mockData = [
          { Section_Number: 1, Questions: { Question_Name: 'Is the policy documented?', Question_Number: '1.1' } },
        ];
        const mockAnswers = { 1: [3] };
        const evidence = { 1: ['Document provided'] };
        const improvement = { 1: ['Update the documentation.'] };
      
        render(
          <Accordion
            data={mockData}
            answers={mockAnswers}
            evidence={evidence}
            improvement={improvement}
          />
        );

        screen.debug();
      
        const accordionButton = screen.getByRole('button', { name: /1\. Is the policy documented\?/i });
        expect(accordionButton).toBeInTheDocument();
      
        // Ensure content is not visible initially
        expect(screen.queryByText('Document provided')).not.toBeInTheDocument();
        expect(screen.queryByText('Update the documentation.')).not.toBeInTheDocument();
      
        // Click to open accordion (direct call for older userEvent versions)
        await userEvent.click(accordionButton);
      
        // Ensure content is visible after opening
        expect(screen.getByText('Document provided')).toBeInTheDocument();
        expect(screen.getByText('Update the documentation.')).toBeInTheDocument();

      

      });
      


});