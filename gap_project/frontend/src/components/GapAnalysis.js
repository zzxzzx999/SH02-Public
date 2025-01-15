import React, { useState } from "react";
import NavBar from './NavBar';
import '../css/GapAnalysis.css';
import {useLocation } from 'react-router-dom';

function Elements() {
  const companyName = localStorage.getItem("companyName");
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

  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions[0].Questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div className="gap">
        <NavBar className="elements" links={links} logout={false} />
          <h1 className="section-title" style={{marginLeft:'16px'}}>{questions[0].Section_Name}</h1>
          <div className="question-text">
            <p style={{marginLeft:'16px'}}>
            <strong>{questions[0].Questions[currentQuestionIndex].Question_Number}: </strong>
            {questions[0].Questions[currentQuestionIndex].Question_Name}
            </p>
          </div>

          <Compliance question={questions[0].Questions[currentQuestionIndex]} />

          <div className="navigation-buttons-container">
            <div className="navigation-buttons">
              <div className="question-buttons">
              {questions[0].Questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => navigateToQuestion(index)}
                  className={currentQuestionIndex === index ? "active" : ""}
                >
                  {question.Question_Number.slice(2)}
                </button>
              ))}                
              </div>

              <button
                className="next-button"
                onClick={goToNextQuestion}
                disabled={currentQuestionIndex === questions[0].Questions.length - 1}
              >
              &gt;
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

  const handleRadioChange = (questionNumber, value) => {
    setSelectedRatings(prevState => ({
      ...prevState,
      [questionNumber]: value 
    }));
  };

  const handleEvidenceChange = (questionNumber, value) => {
    setEvidence(prevState => ({
      ...prevState,
      [questionNumber]: value
    }));
  };

  const handleImprovementChange = (questionNumber, value) => {
    setImprovement(prevState => ({
      ...prevState,
      [questionNumber]: value
    }));
  };

  const options = [
    { value: '5', label: ( <> Exceptional Compliance<br /> (Score 5) </> ), className: 'exceptional', color: '#006613'},
    { value: '4', label: ( <> Good Compliance<br /> (Score 4) </> ), className: 'good', color: '#42C259' },
    { value: '3', label: ( <> Basic Compliance<br /> (Score 3) </> ), className: 'basic', color: '#7CCC8B'},
    { value: '2', label: ( <> Needs Improvement<br /> (Score 2) </> ), className: 'improvement', color: '#FFC546'},
    { value: '1', label:  ( <> Unsatisfactory<br /> (Score 1) </> ), className: 'unsatisfactory', color: '#FF0B0B'},
  ];

  return (
    <div className="compliance-container">
      <div className="compliance-row">
      {options.map(option => (
        <div className="compliance-option" key={option.value}>
          <input
            type="radio"
            id={`question_${question.Question_Number}_${option.value}`}
            name={`question_${question.Question_Number}`} 
            value={option.value}
            checked={selectedRatings[question.Question_Number] === option.value}
            onChange={() => handleRadioChange(question.Question_Number, option.value)}
          />
          <label htmlFor={`question_${question.Question_Number}_${option.value}`} className={`compliance ${option.className}`}>
            {option.label}
            <span
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '50%',
                backgroundColor: option.color,
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                zIndex: '-1',
              }}
            />
          </label>
        </div>
      ))}
      </div>

  <div className="textareas-row">
    <div className="textarea-container">
      <label htmlFor={`evidence_${question.Question_Number}`} className="textarea-label">Evidence</label>
      <div className="textarea-wrapper">
        <textarea
          id={`evidence_${question.Question_Number}`}
          value={evidence[question.Question_Number] || ''}
          onChange={(e) => handleEvidenceChange(question.Question_Number, e.target.value)}
        />
      </div>
    </div>

    <div className="textarea-container">
      <label htmlFor={`improvement_${question.Question_Number}`} className="textarea-label">Improvement</label>
      <div className="textarea-wrapper">
        <textarea
          id={`improvement_${question.Question_Number}`}
          value={improvement[question.Question_Number] || ''}
          onChange={(e) => handleImprovementChange(question.Question_Number, e.target.value)}
        />
      </div>
    </div>
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

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const companyName = params.get('company');
  localStorage.setItem("companyName", companyName);

  return (
    <div>
      <div className="gap-intro">
        <NavBar className="elements" links={links} />

        <p className="move-to-gap"> To move onto the GAP analysis use the navigation bar</p>
        <div className="purpose-benchmarking">
          <div className="purpose">
            <h2 className="purpose-title">Purpose</h2>
            <p className="purpose-text">The Gap Analysis tool identifies an organization’s current status in health and safety management.
            The Gap Analysis applies a set of questions which cover the general scope of a health and safety management system.</p>
          </div>
          <div className="benchmarking">
            <h2 className="benchmarking-title">Benchmarking</h2>
            <p className="benchmarking-text">The Gap Analysis benchmarks the organization against Gordon Foley’s ‘best in class’ standards and creates a phased improvement plan for health and safety, with options for periodic progress checks.</p>
          </div>
        </div>
        <p className="gap-intro-outputs">The Gap Analysis process produces 3 main outputs:</p>
        <div className="gap-outputs">
          <ul>
            <div className="output">
              <li className="output-text">
                  A detailed review as an outcome of the 12 key theme question sets.
              </li>
              <img src='/review.png' className="output-img" alt="Review Image" style={{width:"15%", height:"40%"}}/>
            </div>
            <div className="output">
              <li className="output-text">
                  A benchmarking scorecard and dashboard.
              </li>
              <img src='/benchmarking.png' className="output-img" alt="Benchmarking Image" style={{width:"30%", height: "50%"}}/>
            </div>

            <div className="output">
              <li className="output-text">
                  A phased improvement plan to promote improvement.
              </li>
              <img src='/improvement.png' className="output-img" alt="Improvement Image" style={{width:"30%", height: "50%"}}/>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default GapAnalysis;
