import React, { useState, useEffect } from "react";
import NavBar from './NavBar';
import '../css/GapAnalysis.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function Elements() {
  const companyName = localStorage.getItem("companyName");

  const links = [
    { name: 'Policy', path: `/gap-analysis/policy?company=${encodeURIComponent(companyName)}&element=0`, image: '' },
    { name: 'Management', path: `/gap-analysis/management?company=${encodeURIComponent(companyName)}&element=1`, image: '' },
    { name: 'Documented System', path: `/gap-analysis/documented-system?company=${encodeURIComponent(companyName)}&element=2`, image: '' },
    { name: 'Meetings', path: `/gap-analysis/meetings?company=${encodeURIComponent(companyName)}&element=3`, image: '' },
    { name: 'Performance Measurement', path: `/gap-analysis/performance-measurement?company=${encodeURIComponent(companyName)}&element=4`, image: '' },
    { name: 'Committee & Representatives', path: `/gap-analysis/committee-and-representatives?company=${encodeURIComponent(companyName)}&element=5`, image: '' },
    { name: 'Investigation Process', path: `/gap-analysis/investigation-process?company=${encodeURIComponent(companyName)}&element=6`, image: '' },
    { name: 'Incident Reporting', path: `/gap-analysis/incident-reporting?company=${encodeURIComponent(companyName)}&element=7`, image: '' },
    { name: 'Training Plan', path: `/gap-analysis/training-plan?company=${encodeURIComponent(companyName)}&element=8`, image: '' },
    { name: 'Risk Management Process', path: `/gap-analysis/risk-management-process?company=${encodeURIComponent(companyName)}&element=9`, image: '' },
    { name: 'Audit & Inspection Process', path: `/gap-analysis/audit-and-inspection-process?company=${encodeURIComponent(companyName)}&element=10`, image: '' },
    { name: 'Improvement Planning', path: `/gap-analysis/policy?improvement-planning=${encodeURIComponent(companyName)}&element=11`, image: '' },
  ];

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const set = parseInt(params.get('element'));

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});  // To manage saved answers

  // Effect to fetch questions from the API when 'set' changes
  useEffect(() => {
    const fetchQuestion = async (set, number) => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/getQuestionOrWriteAnswer/", {
          GetOrWrite: "GET",
          Set: set,
          Number: number
        });
        return response.data.Questions ? [response.data] : [];
      } catch (error) {
        console.error('Error fetching question:', error.response?.data || error.message);
        return [];
      }
    };

    const fetchData = async () => {
      let allQuestions = [];
      for (let i = 1; i <= 10; i++) {
        const questionData = await fetchQuestion(set + 1, i);
        allQuestions = [...allQuestions, ...questionData];
      }
      setQuestions(allQuestions);
      setCurrentQuestionIndex(0); // Reset to the first question when set changes
    };

    fetchData();
  }, [set]);

  // Effect to load saved answers from localStorage on initial load
  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem('answers'));
    if (savedAnswers) {
      setAnswers(savedAnswers); // Load answers into state
    }
  }, []);  // Run once when the component mounts

  // Handle the answer change and store it in localStorage
  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prevAnswers => {
      const updatedAnswers = { ...prevAnswers, [questionId]: answer };
      localStorage.setItem('answers', JSON.stringify(updatedAnswers));  // Persist the answers to localStorage
      return updatedAnswers;
    });
  };

  // Navigate to a specific question
  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Go to the next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div className="gap">
      {/* Navigation Bar */}
      <NavBar className="elements" links={links} logout={false} />

      {questions.length > 0 && (
        <div>
          <h1 className="section-title" style={{ marginLeft: '16px' }}>
            {questions[currentQuestionIndex]?.Section_Name}
          </h1>

          <div className="question-text">
            <p style={{ marginLeft: '16px' }}>
              <strong>{questions[currentQuestionIndex]?.Questions?.Question_Number}: </strong>
              {questions[currentQuestionIndex]?.Questions?.Question_Name}
            </p>
          </div>

          {/* Render the Compliance component */}
          <Compliance
            question={questions[currentQuestionIndex]?.Questions}
            handleAnswerChange={handleAnswerChange}  // Use answer change handler
            savedAnswer={answers[questions[currentQuestionIndex]?.Questions?.Question_Number]}  // Retrieve the saved answer
          />

          <div className="navigation-buttons-container">
            <div className="navigation-buttons">
              {/* Generate buttons for each question */}
              {questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => navigateToQuestion(index)}
                  className={currentQuestionIndex === index ? "active" : ""}
                >
                  {String(question.Questions.Question_Number).split('.')[1]?.slice(0, 2)}
                </button>
              ))}

              {/* "Next" button */}
              <button
                className="next-button"
                onClick={goToNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export { Elements };




function Compliance({ question, handleAnswerChange, savedAnswer }) {
  const [selectedRatings, setSelectedRatings] = useState({});
  const [evidence, setEvidence] = useState({});
  const [improvement, setImprovement] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const answersPayload = Object.keys(selectedRatings).map(questionId => ({
      question: questionId,
      selectedRating: selectedRatings[questionId],
      evidence: evidence[questionId] || '',
      improvement: improvement[questionId] || ''
    }));

    // POST request to save answers
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/getQuestionOrWriteAnswer/', 
        {
          GetOrWrite: "WRITE",
          //gap id here
          answers: answersPayload,
        }
      );

      if (response.status === 201) {
        alert('Answers saved successfully');
      }
    } catch (err) {
      setError('Failed to save answers: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (savedAnswer) {
      // If the savedAnswer exists, set it for the specific question
      setSelectedRatings({ [question.Question_Number]: savedAnswer.selectedRating });
      setEvidence({ [question.Question_Number]: savedAnswer.evidence });
      setImprovement({ [question.Question_Number]: savedAnswer.improvement });
    }
  }, [savedAnswer, question.Question_Number]);

  useEffect(() => {
    if (savedAnswer) {
      // If the savedAnswer exists, set it for the specific question
      setSelectedRatings({ [question.Question_Number]: savedAnswer.selectedRating });
      setEvidence({ [question.Question_Number]: savedAnswer.evidence });
      setImprovement({ [question.Question_Number]: savedAnswer.improvement });
    }
  }, [savedAnswer, question.Question_Number]);

  useEffect(() => {
    if (savedAnswer) {
      // If the savedAnswer exists, set it for the specific question
      setSelectedRatings({ [question.Question_Number]: savedAnswer.selectedRating });
      setEvidence({ [question.Question_Number]: savedAnswer.evidence });
      setImprovement({ [question.Question_Number]: savedAnswer.improvement });
    }
  }, [savedAnswer, question.Question_Number]);

  const handleRadioChange = (questionNumber, value) => {
    setSelectedRatings(prevState => ({
      ...prevState,
      [questionNumber]: value 
    }));

    handleAnswerChange(questionNumber, { 
      selectedRating: value, 
      evidence: evidence[questionNumber], 
      improvement: improvement[questionNumber] 
      });
  };

  const handleEvidenceChange = (questionNumber, value) => {
    setEvidence(prevState => ({
      ...prevState,
      [questionNumber]: value
    }));
    handleAnswerChange(questionNumber, { 
      selectedRating: selectedRatings[questionNumber], 
      evidence: value, 
      improvement: improvement[questionNumber] });
  };

  const handleImprovementChange = (questionNumber, value) => {
    setImprovement(prevState => ({
      ...prevState,
      [questionNumber]: value
    }));
    handleAnswerChange(questionNumber, { 
      selectedRating: selectedRatings[questionNumber], 
      evidence: evidence[questionNumber] , 
      improvement: value
    });
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

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const companyName = params.get('company');
  localStorage.setItem("companyName", companyName);

  const links = [
    { name: 'Policy', path: `/gap-analysis/policy?company=${encodeURIComponent(companyName)}&element=0`, image: '' },
    { name: 'Management', path: `/gap-analysis/management?company=${encodeURIComponent(companyName)}&element=1`, image: '' },
    { name: 'Documented System', path: `/gap-analysis/documented-system?company=${encodeURIComponent(companyName)}&element=2`, image: '' },
    { name: 'Meetings', path: `/gap-analysis/meetings?company=${encodeURIComponent(companyName)}&element=3`, image: '' },
    { name: 'Performance Measurement', path: `/gap-analysis/performance-measurement?company=${encodeURIComponent(companyName)}&element=4`, image: '' },
    { name: 'Committee & Representatives', path: `/gap-analysis/committee-and-representatives?company=${encodeURIComponent(companyName)}&element=5`, image: '' },
    { name: 'Investiagtion Process', path: `/gap-analysis/investigation-process?company=${encodeURIComponent(companyName)}&element=6`, image: '' },
    { name: 'Incident Reporting', path: `/gap-analysis/incident-reporting?company=${encodeURIComponent(companyName)}&element=7`, image: '' },
    { name: 'Training Plan', path: `/gap-analysis/training-plan?company=${encodeURIComponent(companyName)}&element=8`, image: '' },
    { name: 'Risk Management Process', path: `/gap-analysis/risk-management-process?company=${encodeURIComponent(companyName)}&element=9`, image: '' },
    { name: 'Audit & Inspection Process', path: `/gap-analysis/audit-and-inspection-process?company=${encodeURIComponent(companyName)}&element=10`, image: '' },
    { name: 'Improvement Planning', path: `/gap-analysis/policy?improvement-planning=${encodeURIComponent(companyName)}&element=11`, image: '' },
  ];

  console.log("company name: " + companyName);
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
