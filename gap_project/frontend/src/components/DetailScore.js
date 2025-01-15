import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import '../css/DetailScore.css';
import '../css/NavBar.css';
import NavBar from "./NavBar";


function DetailScore() {
  const location = useLocation(); // require para
  const params = new URLSearchParams(location.search);
  const companyName = params.get('company');
  const elementName = params.get('title');
  localStorage.setItem("companyName", companyName);

  console.log("company name: " + companyName);

  console.log("element name: " + elementName);

  const [scores, setScores] = useState({}); // store score
  const [totalScore, setTotalScore] = useState(0);

  // Calculate total score
  useEffect(() => {
    console.log(`Requesting: http://localhost:8000/api/scores/${companyName}/${elementName}/`);
    axios.get(`http://localhost:8000/api/scores/${companyName}/${elementName}/`)
     .then((response) => {
        console.log( response.data);
        const { scores } = response.data;
        setScores(scores);
        // cal total score
        const newTotalScore =
          scores.exceptionalCompliance +
          scores.goodCompliance +
          scores.basicCompliance +
          scores.needsImprovement +
          scores.unsatisfactory;
        setTotalScore(newTotalScore);
      })
     .catch((error) => {
        console.error("Error fetching scores:", error);
      });
  }, [companyName, elementName]);
  
  //Navbar
  const linksForPage3 = [
    { name: 'Overall Results', path: `/overall-output?company=${encodeURIComponent(companyName)}`, image: '/back-button.png' },
    { name: 'Policy', path: `/detail-score?company=${encodeURIComponent(companyName)}&title=${encodeURIComponent('Policy')}` },
    { name: 'Management', path: `/detail-score?company=${encodeURIComponent(companyName)}&title=${encodeURIComponent('Management')}` },
    { name: 'Documented System', path: `/detail-score?company=${encodeURIComponent(companyName)}&title=${encodeURIComponent('Documented System')}` },
    { name: 'Meetings', path: `/detail-score?company=${encodeURIComponent(companyName)}&title=${encodeURIComponent('Meeting')}` },
    { name: 'Performance Measurement', path: `/detail-score?company=${encodeURIComponent(companyName)}&title=${encodeURIComponent('Performance Measurement')}` },
    { name: 'Committee & Representatives', path: `/detail-score?company=${encodeURIComponent(companyName)}&title=${encodeURIComponent('Committee & Representatives')}` },
    { name: 'Investigation Process', path: `/detail-score?company=${encodeURIComponent(companyName)}&title=${encodeURIComponent('Investigation Process')}` },
    { name: 'Incident Reporting', path: `/detail-score?company=${encodeURIComponent(companyName)}&title=${encodeURIComponent('Incident Reporting')}` },
    { name: 'Training Plan', path: `/detail-score?company=${encodeURIComponent(companyName)}&title=${encodeURIComponent('Training Plan')}` },
    { name: 'Risk Management Process', path: `/detail-score?company=${encodeURIComponent(companyName)}&title=${encodeURIComponent('Risk Management Process')}` },
    { name: 'Audit & Inspection Process', path: `/detail-score?company=${encodeURIComponent(companyName)}&title=${encodeURIComponent('Audit & Inspection Process')}` },
    { name: 'Improvement Planning', path: `/detail-score?company=${encodeURIComponent(companyName)}&title=${encodeURIComponent('Improvement Planning')}` },
];
  
  return (
    <div class="main-content" className="gap-intro">
      <NavBar links={linksForPage3} logout={true}/>
      <div className="detail-output-container">
        {/* Header with Title and Total Score */}
        <div className="header">
          <h1>{elementName} </h1>
          <span id="total-score">{totalScore}/50</span>
        </div>

        {/* Compliance Scores */}
        <div className="compliance-scores">
          <div className="block detail-exceptional-compliance">
            <div class="upper">Exceptional Compliance <span>(Score 5)</span></div>
            <div class="lower">{scores.exceptionalCompliance}</div>
          </div>
          <div className="block detail-good-compliance">
            <div class="upper">Good Compliance <span>(Score 4)</span></div>
            <div class="lower">{scores.goodCompliance}</div>
          </div>
          <div className="block detail-basic-compliance">
            <div class="upper">Basic Compliance <span>(Score 3)</span></div>
            <div class="lower">{scores.basicCompliance}</div>
          </div>
          <div className="block detail-needs-improvement">
            <div class="upper">Needs Improvement <span>(Score 2)</span></div>
            <div class="lower">{scores.needsImprovement}</div>
          </div>
          <div className="block detail-unsatisfactory">
            <div class="upper">Unsatisfactory <span>(Score 1)</span></div>
            <div class="lower">{scores.unsatisfactory}</div>
          </div>
        </div>

        {/* Pie Chart Placeholder */}
        <div className="pie-chart">[Chart Placeholder]</div>
      </div>
      </div>
  );
}

export default DetailScore;
