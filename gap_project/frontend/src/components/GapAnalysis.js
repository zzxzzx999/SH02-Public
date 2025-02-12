import React, { useState, useEffect, useRef } from "react";
import NavBar from './NavBar';
import '../css/GapAnalysis.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

let gapID = null;

function Elements() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const set = parseInt(params.get('element'));
  const companyName = params.get('company');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // set up improvement plan
  const getDefaultImprovementPlan = () => {
    return {
      evidence: Object.fromEntries(
        Array.from({ length: 12 }, (_, i) => [i + 1, Array(10).fill("")]) 
      ),
      improvement: Object.fromEntries(
        Array.from({ length: 12 }, (_, i) => [i + 1, Array(10).fill("")]) 
      ),
    };
  }

  // try to set improvement plan with default
  const [improvementPlan, setImprovementPlan] = useState(getDefaultImprovementPlan());
  
  // if answers is not populated yet, fill it with empty entries
  useEffect(() => {
    if (!improvementPlan.improvement) {
      setImprovementPlan(getDefaultImprovementPlan());
    }
  }, [improvementPlan]);

  // set up answers
  const getDefaultAnswers = () => {
    return Object.fromEntries(
      Array.from({ length: 12 }, (_, i) => [i + 1, Array(10).fill(0)])
    );
  };

  // try to set answers to default when initialising it
  const [answers, setAnswers] = useState(getDefaultAnswers()); 

  // if answers is not populated yet, fill it with empty entries (0s)
  useEffect(() => {
    if (!answers || Object.keys(answers).length === 0) {
      setAnswers(getDefaultAnswers());
    }
  }, [answers]);

  useEffect(() => {
    if (answers && typeof answers === "object") {
        setIsComplete(
            Object.values(answers).every(section => 
                section.every(answer => answer !== 0)
            )
        );
    }
  }, [answers]);

  // keep incase user refreshes page
  useEffect(() => {
    const savedAnswers = localStorage.getItem('answers');
    const savedImprovementPlan = localStorage.getItem('improvementPlan');
  
    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers);
        setAnswers(parsedAnswers);
      } catch (error) {
        console.error("Error parsing saved answers:", error);
        setAnswers(getDefaultAnswers());
      }
    } else {
      setAnswers(getDefaultAnswers());
    }
  
    if (savedImprovementPlan) {
      try {
        const parsedImprovementPlan = JSON.parse(savedImprovementPlan); 
        setImprovementPlan(parsedImprovementPlan); 
      } catch (error) {
        setImprovementPlan(getDefaultImprovementPlan());
      }
    } else {
      setImprovementPlan(getDefaultImprovementPlan());
    }
  }, []);

  const links = [
    { name: 'Policy', path: `/gap-analysis/policy?company=${encodeURIComponent(companyName)}&element=0&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Management', path: `/gap-analysis/management?company=${encodeURIComponent(companyName)}&element=1&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Documented System', path: `/gap-analysis/documented-system?company=${encodeURIComponent(companyName)}&element=2&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Meetings', path: `/gap-analysis/meetings?company=${encodeURIComponent(companyName)}&element=3&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Performance Measurement', path: `/gap-analysis/performance-measurement?company=${encodeURIComponent(companyName)}&element=4&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Committee & Representatives', path: `/gap-analysis/committee-and-representatives?company=${encodeURIComponent(companyName)}&element=5&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Investigation Process', path: `/gap-analysis/investigation-process?company=${encodeURIComponent(companyName)}&element=6&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Incident Reporting', path: `/gap-analysis/incident-reporting?company=${encodeURIComponent(companyName)}&element=7&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Training Plan', path: `/gap-analysis/training-plan?company=${encodeURIComponent(companyName)}&element=8&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Risk Management Process', path: `/gap-analysis/risk-management-process?company=${encodeURIComponent(companyName)}&element=9&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Audit & Inspection Process', path: `/gap-analysis/audit-and-inspection-process?company=${encodeURIComponent(companyName)}&element=10&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Improvement Planning', path: `/gap-analysis/policy?improvement-planning=${encodeURIComponent(companyName)}&element=11&gap_id=${encodeURIComponent(gapID)}`, image: '' },
  ];

  // Format answers for backend
  const prepareAnswers = () => {
    const formattedAnswers = {};

    Object.keys(answers).forEach(questionId => {
      const [set, number] = questionId.split('.');
      const answer = answers[questionId];
      
      const sequentialKey = parseInt(number); 

      if (!formattedAnswers[sequentialKey]) {
        formattedAnswers[sequentialKey] = 0;
      }

      if (answer && answer.selectedRating) {
        formattedAnswers[sequentialKey] = parseInt(answer.selectedRating);
      } else {
        formattedAnswers[sequentialKey] = 0;
      }
    });
    return formattedAnswers;
  };

  // Send data to API to backend
  const submitAnswersToAPI = async (finished) => {
    localStorage.removeItem("answers");
    localStorage.removeItem("improvementPlan");
    localStorage.removeItem("companyName");
    for (let key in answers) {
      answers[key] = answers[key].filter(value => value !== '').map(value => Number(value));
    }
    try {
      await axios.post("http://127.0.0.1:8000/api/getQuestionOrWriteAnswer/", {
        GetOrWrite: "WRITE",
        id: localStorage.getItem("gapID"),
        answers: answers,
        improvementPlan: improvementPlan,
        finished: finished,
        company_name: companyName,
      });
    } catch (error) {
      console.error("Error submitting answers:", error.response?.data || error.message);
    }
    localStorage.removeItem("gapID");
  };
  

  // Effect to fetch questions from the API 
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
      setCurrentQuestionIndex(0); 
    };

    fetchData();
  }, [set]);

    // get incomplete data from backend when resuming gap analysis
    useEffect(() => {
      const getAnswers = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/get_incomplete_answers/", {
            params: { gap_id: gapID },
          });
          setAnswers(response.data["gap_data"]);
          setImprovementPlan(response.data["improvement_plan"])

        } catch (error) {
          console.error("Error fetching incomplete answers:", error.response?.data || error.message);
        }
      };
  
      if (gapID) {
        getAnswers();
      }
  }, [gapID]);

  // Save to localStorage when answers or improvementPlan change (like when they first load in)
  useEffect(() => {
    if (answers && Object.keys(answers).length > 0) {
      localStorage.setItem("answers", JSON.stringify(answers));
    }
    if (improvementPlan && Object.keys(improvementPlan).length > 0) {
      localStorage.setItem("improvementPlan", JSON.stringify(improvementPlan));
    }
    if (gapID) {
      localStorage.setItem("gapID", gapID);
    }
  }, [answers, improvementPlan, gapID]);


  const handleAnswerChange = (type, key, value, index) => {
    const updatedAnswers = { ...answers };
    const updatedImprovementPlan = { ... improvementPlan};
    index = index - 1

    if (type == 'a'){
      updatedAnswers[key][index] = value;
      setAnswers(updatedAnswers);
      localStorage.setItem('answers', JSON.stringify(updatedAnswers));
    }
    else if (type == 'i'){
      updatedImprovementPlan.improvement[key][index] = value;
      setImprovementPlan(updatedImprovementPlan);
      localStorage.setItem('improvementPlan', JSON.stringify(updatedImprovementPlan));
    }
    else {
      updatedImprovementPlan.evidence[key][index] = value;
      setImprovementPlan(updatedImprovementPlan);
      localStorage.setItem('improvementPlan', JSON.stringify(updatedImprovementPlan));
    }
  };
  
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
      <SubmitProvider submitAnswersToAPI={submitAnswersToAPI}>
        <NavBar className="elements" links={links} logout={false} isComplete={isComplete} />
      </SubmitProvider>
  
      {questions.length > 0 && (
        <div>
          <h1 className="section-title" style={{ marginLeft: '16px' }}>
            {questions[currentQuestionIndex]?.Section_Name}
          </h1>
  
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
      )}
    </div>
  );
}  
export { Elements };

function Compliance({ question }) {
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
      improvementPlan: {
        evidence: evidence[questionId] || '',
        improvement: improvement[questionId] || ''
      }
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
    setSelectedRatings((prevState) => ({ 
      ...prevState, 
      [question.Question_Number]: savedAnswer 
    }));
  
    setImprovement((prevState) => ({
      ...prevState,
      [question.Question_Number]: savedImprovement
    }));
  
    setEvidence((prevState) => ({
      ...prevState,
      [question.Question_Number]: savedEvidence
    }));
  }, [savedAnswer, savedImprovement, savedEvidence, question.Question_Number]);
  

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
            checked={selectedRatings[question.Question_Number] === Number(option.value)}
            onChange={() => handleRadioChange(question.Question_Number, Number(option.value))}
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

  const [error, setError] = useState('');
  const [links, setLinks] = useState([])

  useEffect(() => {
    const getGapID = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/get-latest-gap/?company_name=${companyName}`);
            gapID = response.data.gap_id;
            localStorage.setItem("gapID", gapID);

            const newLinks = [
              { name: 'Policy', path: `/gap-analysis/policy?company=${encodeURIComponent(companyName)}&element=0&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Management', path: `/gap-analysis/management?company=${encodeURIComponent(companyName)}&element=1&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Documented System', path: `/gap-analysis/documented-system?company=${encodeURIComponent(companyName)}&element=2&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Meetings', path: `/gap-analysis/meetings?company=${encodeURIComponent(companyName)}&element=3&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Performance Measurement', path: `/gap-analysis/performance-measurement?company=${encodeURIComponent(companyName)}&element=4&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Committee & Representatives', path: `/gap-analysis/committee-and-representatives?company=${encodeURIComponent(companyName)}&element=5&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Investigation Process', path: `/gap-analysis/investigation-process?company=${encodeURIComponent(companyName)}&element=6&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Incident Reporting', path: `/gap-analysis/incident-reporting?company=${encodeURIComponent(companyName)}&element=7&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Training Plan', path: `/gap-analysis/training-plan?company=${encodeURIComponent(companyName)}&element=8&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Risk Management Process', path: `/gap-analysis/risk-management-process?company=${encodeURIComponent(companyName)}&element=9&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Audit & Inspection Process', path: `/gap-analysis/audit-and-inspection-process?company=${encodeURIComponent(companyName)}&element=10&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Improvement Planning', path: `/gap-analysis/policy?improvement-planning=${encodeURIComponent(companyName)}&element=11&gap_id=${encodeURIComponent(gapID)}`, image: '' },
            ];
          
          
            setLinks(newLinks);
        } catch (err) {
            setError("Error fetching gap analysis ID.");
            console.error(err);
        }
      };
      getGapID();

  }, []);


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
