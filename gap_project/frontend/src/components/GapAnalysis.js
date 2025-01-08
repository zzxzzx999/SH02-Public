import React, { useState } from "react";
import NavBar from './NavBar';

function Elements() {
  const links = [
    { name: 'Policy', path: '/gap-analysis/policy', image: '' },
    { name: 'Management', path: '/gap-analysis/management', image: '' },
    { name: 'Documented System', path: '/gap-analysis/documented-system', image: '' },
    { name: 'Meetings', path: '/gap-analysis/meetings', image: '' },
    { name: 'Performance Measurement', path: '/gap-analysis/performance-measurement', image: '' },
    { name: 'Committee & Representatives', path: '/gap-analysis/committee-and-representatives', image: '' },
    { name: 'Investiagtion Process', path: '/gap-analysis/investigation-process', image: '' },
    { name: 'Incident Reporting', path: '/gap-analysis/incident-reporting', image: '' },
    { name: 'Training Plan', path: '/gap-analysis/training-plan', image: '' },
    { name: 'Risk Management Process', path: '/gap-analysis/risk-management-process', image: '' },
    { name: 'Audit & Inspection Process', path: '/gap-analysis/audit-and-inspection-process', image: '' },
    { name: 'Improvement Planning', path: '/gap-analysis/improvement-planning', image: '' },
  ];

  const questions = [
    {
      Section_Number: 1,
      Section_Name: "Health and Safety Policy",
      Questions: [
        {
          Question_Number: "1.1",
          Question_Name: "The organisation has a valid written health and safety policy in place, signed within 12 months, and distributed to all employees."
        },
        {
          Question_Number: "1.2",
          Question_Name: "The organisation understands its responsibilities for H&S towards employees, customers, visitors, and members of the public and this is made clear within the written health and safety policy."
        }
      ]
    }
  ];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Function to navigate to a specific question
  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions[0].Questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div>
      <div className="gap">
        <NavBar className="elements" links={links} logout={false} />
          <h1>{questions[0].Section_Name}</h1>
          <p>
            <strong>{questions[0].Questions[currentQuestionIndex].Question_Number}:</strong>
            {questions[0].Questions[currentQuestionIndex].Question_Name}
          </p>

          <Compliance question={questions[0].Questions[currentQuestionIndex]} />

          <div className="navigation-buttons">
            <button onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0}>
              &lt; Previous
            </button>
            <button onClick={goToNextQuestion} disabled={currentQuestionIndex === questions[0].Questions.length - 1}>
              Next &gt;
            </button>
          </div>

          <div className="navigation-buttons">
            {/* Button navigation for questions 1 and 2 */}
            <button 
              onClick={() => navigateToQuestion(0)} 
              className={currentQuestionIndex === 0 ? "active" : ""}>
              1
            </button>
            <button 
              onClick={() => navigateToQuestion(1)} 
              className={currentQuestionIndex === 1 ? "active" : ""}>
              2
            </button>
          </div>

        </div>
      </div>
  );
}
export { Elements };

function Compliance({ question }) {
  const [selectedRatings, setSelectedRatings] = useState({});
  const [evidence, setEvidence] = useState({});
  const [improvement, setImprovement] = useState({});

  // Handle changes in the radio buttons
  const handleRadioChange = (questionNumber, value) => {
    setSelectedRatings(prevState => ({
      ...prevState,
      [questionNumber]: value // Update rating for the specific question
    }));
  };

  // Handle evidence input change
  const handleEvidenceChange = (questionNumber, value) => {
    setEvidence(prevState => ({
      ...prevState,
      [questionNumber]: value
    }));
  };

  // Handle improvement input change
  const handleImprovementChange = (questionNumber, value) => {
    setImprovement(prevState => ({
      ...prevState,
      [questionNumber]: value
    }));
  };

  const options = [
    { value: '5', label: 'Exceptional Compliance (Score 5)', className: 'exceptional' },
    { value: '4', label: 'Good Compliance (Score 4)', className: 'good' },
    { value: '3', label: 'Basic Compliance (Score 3)', className: 'basic' },
    { value: '2', label: 'Needs Improvement (Score 2)', className: 'improvement' },
    { value: '1', label: 'Unsatisfactory (Score 1)', className: 'unsatisfactory' }
  ];

  return (
    <div className="compliance-container">
      {options.map(option => (
        <div className="compliance-option" key={option.value}>
          <input
            type="radio"
            id={`question_${question.Question_Number}_${option.value}`}
            name={`question_${question.Question_Number}`}  // Unique name for each question
            value={option.value}
            checked={selectedRatings[question.Question_Number] === option.value} // Check if selected value for this question matches
            onChange={() => handleRadioChange(question.Question_Number, option.value)} // Update rating for the specific question
          />
          <label htmlFor={`question_${question.Question_Number}_${option.value}`} className={`compliance ${option.className}`}>
            {option.label}
          </label>
        </div>
      ))}

      {/* Evidence Textarea */}
      <div>
        <label htmlFor={`evidence_${question.Question_Number}`}>Evidence:</label>
        <textarea
          id={`evidence_${question.Question_Number}`}
          value={evidence[question.Question_Number] || ''}
          onChange={(e) => handleEvidenceChange(question.Question_Number, e.target.value)}
          placeholder="Enter evidence here..."
        />
      </div>

      {/* Improvement Textarea */}
      <div>
        <label htmlFor={`improvement_${question.Question_Number}`}>Improvement:</label>
        <textarea
          id={`improvement_${question.Question_Number}`}
          value={improvement[question.Question_Number] || ''}
          onChange={(e) => handleImprovementChange(question.Question_Number, e.target.value)}
          placeholder="Enter improvement here..."
        />
      </div>
    </div>
  );
}
export { Compliance };

function GapAnalysis() {
  const links = [
    { name: 'Policy', path: '/gap-analysis/policy', image: '' },
    { name: 'Management', path: '/gap-analysis/management', image: '' },
    { name: 'Documented System', path: '/gap-analysis/documented-system', image: '' },
    { name: 'Meetings', path: '/gap-analysis/meetings', image: '' },
    { name: 'Performance Measurement', path: '/gap-analysis/performance-measurement', image: '' },
    { name: 'Committee & Representatives', path: '/gap-analysis/committee-and-representatives', image: '' },
    { name: 'Investiagtion Process', path: '/gap-analysis/investigation-process', image: '' },
    { name: 'Incident Reporting', path: '/gap-analysis/incident-reporting', image: '' },
    { name: 'Training Plan', path: '/gap-analysis/training-plan', image: '' },
    { name: 'Risk Management Process', path: '/gap-analysis/risk-management-process', image: '' },
    { name: 'Audit & Inspection Process', path: '/gap-analysis/audit-and-inspection-process', image: '' },
    { name: 'Improvement Planning', path: '/gap-analysis/improvement-planning', image: '' },
  ];

  return (
    <div>
      <div className="gap">
        <NavBar className="elements" links={links} />
        <p>To move onto the GAP analysis use the navigation bar</p>
        <h2>Purpose</h2>
        <p>The Gap Analysis tool identifies an organization’s current status in health and safety management.
        The Gap Analysis applies a set of questions which cover the general scope of a health and safety management system.</p>
        <h2>Benchmarking</h2>
        <p>The Gap Analysis benchmarks the organization against Gordon Foley’s ‘best in class’ standards and creates a phased improvement plan for health and safety, with options for periodic progress checks.</p>
        <p>The Gap Analysis process produces 3 main outputs:</p>
        <ul>
          <li>A detailed review as an outcome of the 12 key theme question sets</li>
          <li>A benchmarking scorecard and dashboard</li>
          <li>A phased improvement plan</li>
        </ul>
      </div>
    </div>
  );
}

export default GapAnalysis;
