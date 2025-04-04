import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import '../css/GapAnalysis.css';
import Accordion from './Accordion.js';
import NavBar from './NavBar.js';
import { SubmitProvider } from './SubmitContext.js';

let gapID = null;

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
  // set up answers
  const getDefaultAnswers = () => {
    return Object.fromEntries(
      Array.from({ length: 12 }, (_, i) => [i + 1, Array(10).fill(0)])
    );
  };

function Elements() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sectionName = params.get('element'); // for example "section1"
  const set = parseInt(sectionName.replace('section', '')) - 1; //change to int index
  const companyName = params.get('company');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [improvementPlan, setImprovementPlan] = useState(getDefaultImprovementPlan());// try to set improvement plan with default
  const [answers, setAnswers] = useState(getDefaultAnswers()); // try to set answers to default when initialising it
 
  // if answers is not populated yet, fill it with empty entries
  useEffect(() => {
    if (!improvementPlan.improvement) {
      setImprovementPlan(getDefaultImprovementPlan());
    }
  }, [improvementPlan]);

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
  
  // sort of prevents user from going using the back button - for some reason it only prevents them from going out of the question set by using the back button (on the browser), 
  //so it keeps them in the question set and also no answers get lost when it is clicked
  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  }, []);

  const links = [
    { name: 'Section 1', path: `/gap-analysis/section1?company=${encodeURIComponent(companyName)}&element=section1&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Section 2', path: `/gap-analysis/section2?company=${encodeURIComponent(companyName)}&element=section2&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Section 3', path: `/gap-analysis/section3?company=${encodeURIComponent(companyName)}&element=section3&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Section 4', path: `/gap-analysis/section4?company=${encodeURIComponent(companyName)}&element=section4&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Section 5', path: `/gap-analysis/section5?company=${encodeURIComponent(companyName)}&element=section5&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Section 6', path: `/gap-analysis/section6?company=${encodeURIComponent(companyName)}&element=section6&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Section 7', path: `/gap-analysis/section7?company=${encodeURIComponent(companyName)}&element=section7&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Section 8', path: `/gap-analysis/section8?company=${encodeURIComponent(companyName)}&element=section8&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Section 9', path: `/gap-analysis/section9?company=${encodeURIComponent(companyName)}&element=section9&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Section 10', path: `/gap-analysis/section10?company=${encodeURIComponent(companyName)}&element=section10&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Section 11', path: `/gap-analysis/section11?company=${encodeURIComponent(companyName)}&element=section11&gap_id=${encodeURIComponent(gapID)}`, image: '' },
    { name: 'Section 12', path: `/gap-analysis/section12?company=${encodeURIComponent(companyName)}&element=section12&gap_id=${encodeURIComponent(gapID)}`, image: '' },
  ];

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

        // initialize Section_Name
      if (questionData.length > 0 && questionData[0]) {
        questionData[0] = {
          ...questionData[0],
          Section_Name: `Section ${set + 1}`,
          Section_Number: set + 1
        };
      }
        allQuestions = [...allQuestions, ...questionData];
      }
      //add an 11th page : the summary page
      allQuestions.push({
        Section_Name: `Summary of Section ${set + 1}`,
        Questions: {
          Question_Number: 'Summary', 
          Question_Name: "",
        },
        isSummaryPage: true
      });
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
  }, []);

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
  }, [answers, improvementPlan]);

  const handleAnswerChange = (type, key, value, index) => {
    const updatedAnswers = { ...answers };
    const updatedImprovementPlan = { ...improvementPlan};
    index = index - 1

    if (type === 'a'){
      updatedAnswers[key][index] = value;
      setAnswers(updatedAnswers);
      localStorage.setItem('answers', JSON.stringify(updatedAnswers));
    }
    else if (type === 'i'){
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
    if (currentQuestionIndex < questions.length - 1) {
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
          {questions[currentQuestionIndex]?.isSummaryPage ? (
          <div className="summary-page">
              <h1 className="section-title" style={{ marginLeft: '16px' }}>
                {questions[currentQuestionIndex]?.Section_Name}
              </h1>
            <Accordion data={questions} answers={answers} improvement={improvementPlan.improvement} evidence={improvementPlan.evidence}/>
          </div>
            ) : (
        <div>
          <h1 className="section-title" style={{ marginLeft: '16px' }}>
            {questions[currentQuestionIndex]?.Section_Name}
          </h1>

          <div className="question-text">
            <p style={{ marginLeft: '16px' }}>
              <strong>{questions[currentQuestionIndex]?.Questions?.Question_Number}: </strong>
              {/* {questions[currentQuestionIndex]?.Questions?.Question_Number} */}
              Sample question content
            </p>
          </div>

          <Compliance
            question={questions[currentQuestionIndex]?.Questions}
            handleAnswerChange={handleAnswerChange}  
            savedAnswer={
                  answers[`${questions[currentQuestionIndex]?.Section_Number}`]?.[
                    questions[currentQuestionIndex]?.Questions?.Question_Number &&
                String(questions[currentQuestionIndex]?.Questions?.Question_Number).split(".")[1] &&
                String(Number(String(questions[currentQuestionIndex]?.Questions?.Question_Number).split(".")[1]) - 1)
              ]
            }
            savedImprovement = {
              improvementPlan.improvement[
                String(questions[currentQuestionIndex]?.Section_Number)
              ]?.[
                String(Number(String(questions[currentQuestionIndex]?.Questions?.Question_Number).split(".")[1]) - 1)
              ]
            }
            savedEvidence = {
              improvementPlan.evidence[
                String(questions[currentQuestionIndex]?.Section_Number)
              ]?.[
                String(Number(String(questions[currentQuestionIndex]?.Questions?.Question_Number).split(".")[1]) - 1)
              ]
            }
          />
              </div>
            )}

          <div className="navigation-buttons-container">
            <div className="navigation-buttons">
              {questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => navigateToQuestion(index)}
                  className={currentQuestionIndex === index ? "active" : ""}
                >
                  {question.isSummaryPage ? ( <span style={{ fontWeight: "bold" }}>Summary</span>) : 
                   (String(question.Questions.Question_Number).split('.')[1]?.slice(0, 2))
                  }
                </button>
              ))}

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

function Compliance({ question, handleAnswerChange, savedAnswer, savedImprovement, savedEvidence }) {
  const [selectedRatings, setSelectedRatings] = useState({});
  const [evidence, setEvidence] = useState({});
  const [improvement, setImprovement] = useState({});

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
    setSelectedRatings((prevState) => ({
      ...prevState,
      [questionNumber]: value,
    }));
  
    const questionNumberStr = String(questionNumber);
    var [key, index] = questionNumberStr.split('.');

    handleAnswerChange('a', key, value, index); 
  };
  
  const handleEvidenceChange = (questionNumber, value) => {
    setEvidence(prevState => ({
      ...prevState,
      [questionNumber]: value
    }));

    const questionNumberStr = String(questionNumber);
    var [key, index] = questionNumberStr.split('.');

    handleAnswerChange('e', key, value, index); 
    }

  const handleImprovementChange = (questionNumber, value) => {
    setImprovement(prevState => ({
      ...prevState,
      [questionNumber]: value
    }))

    const questionNumberStr = String(questionNumber);
    var [key, index] = questionNumberStr.split('.');

    handleAnswerChange('i', key, value, index); 
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

  const [, setError] = useState('');
  const [links, setLinks] = useState([])

  useEffect(() => {
    const getGapID = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/get-latest-gap/?company_name=${companyName}`);
            gapID = response.data.gap_id;
            localStorage.setItem("gapID", gapID);

            const newLinks = [
              { name: 'Section 1', path: `/gap-analysis/section1?company=${encodeURIComponent(companyName)}&element=section1&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Section 2', path: `/gap-analysis/section2?company=${encodeURIComponent(companyName)}&element=section2&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Section 3', path: `/gap-analysis/section3?company=${encodeURIComponent(companyName)}&element=section3&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Section 4', path: `/gap-analysis/section4?company=${encodeURIComponent(companyName)}&element=section4&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Section 5', path: `/gap-analysis/section5?company=${encodeURIComponent(companyName)}&element=section5&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Section 6', path: `/gap-analysis/section6?company=${encodeURIComponent(companyName)}&element=section6&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Section 7', path: `/gap-analysis/section7?company=${encodeURIComponent(companyName)}&element=section7&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Section 8', path: `/gap-analysis/section8?company=${encodeURIComponent(companyName)}&element=section8&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Section 9', path: `/gap-analysis/section9?company=${encodeURIComponent(companyName)}&element=section9&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Section 10', path: `/gap-analysis/section10?company=${encodeURIComponent(companyName)}&element=section10&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Section 11', path: `/gap-analysis/section11?company=${encodeURIComponent(companyName)}&element=section11&gap_id=${encodeURIComponent(gapID)}`, image: '' },
              { name: 'Section 12', path: `/gap-analysis/section12?company=${encodeURIComponent(companyName)}&element=section12&gap_id=${encodeURIComponent(gapID)}`, image: '' },
            ];
          
            setLinks(newLinks);
        } catch (err) {
            setError("Error fetching gap analysis ID.");
            console.error(err);
        }
      };
      getGapID();
  }, [companyName]);

  return (
    <div>
      <div className="gap-intro">
        <NavBar className="elements" links={links} logout={true}/>

        <p className="move-to-gap"> To move onto the GAP analysis use the navigation bar</p>
        <div className="purpose-benchmarking">
          <div className="purpose">
            <h2 className="purpose-title">Purpose</h2>
            <p className="purpose-text">The GAP Analysis tool identifies an organization’s current status in [<i>Custom</i>] management.
            The GAP Analysis applies a set of questions which cover the general scope of a [<i>Custom</i>] management system.</p>
          </div>
          <div className="benchmarking">
            <h2 className="benchmarking-title">Benchmarking</h2>
            <p className="benchmarking-text">The GAP Analysis benchmarks the organization against [<i>Custom Company</i>] standards and creates a phased improvement plan for [<i>Custom</i>] management, with options for periodic progress checks.</p>
          </div>
        </div>
        <p className="gap-intro-outputs">The GAP Analysis process produces 3 main outputs:</p>
        <div className="gap-outputs">
          <ul>
            <div className="output">
              <li className="output-text">
                  A detailed review as an outcome of the [<i>Custom Count n</i>] key theme question sets.
              </li>
              <img src='/review.png' className="output-img" alt="Review" style={{width:"15%", height:"40%"}}/>
            </div>
            <div className="output">
              <li className="output-text">
                  A benchmarking scorecard and dashboard.
              </li>
              <img src='/benchmarking.png' className="output-img" alt="Benchmarking" style={{width:"30%", height: "50%"}}/>
            </div>
            <div className="output">
              <li className="output-text">
                  A phased improvement plan to promote improvement.
              </li>
              <img src='/improvement.png' className="output-img" alt="Improvement" style={{width:"30%", height: "50%"}}/>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default GapAnalysis;
