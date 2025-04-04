import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../css/DetailScore.css';
import '../css/NavBar.css';
import NavBar from "./NavBar.js";
import PieChart from "./charts/PieChart.js";
import ChartTable from "./charts/Tally.js";

function DetailScore() {
  const location = useLocation(); // require para
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const companyName = params.get('company');
  const elementName = params.get('title');
  const gapId = params.get("gap_id");
  const userRole = localStorage.getItem("userRole");  
  localStorage.setItem("companyName", companyName);

  console.log("company name: " + companyName);
  console.log("element name: " + elementName);

  const [scores, setScores] = useState({}); // store score
  const [totalScore, setTotalScore] = useState(0);
  const [pieData, setPieData] = useState([]);

  // Handle last and next button click
  const handlePrevious = () => {
    const currentIndex = linksForPage3.findIndex(link => link.name === elementName);
    if (currentIndex > 1 ) {
      const previousElement = linksForPage3[currentIndex - 1];
      if (previousElement && previousElement.path) {
        navigate(previousElement.path);
      }
    }
  };
    
  const handleNext = () => {
    const currentIndex = linksForPage3.findIndex(link => link.name === elementName);
    if (currentIndex >= 0 && currentIndex < linksForPage3.length - 1) {
      const nextElement = linksForPage3[currentIndex + 1];
      if (nextElement && nextElement.path) {
        navigate(nextElement.path); // Navigate to the next path
      }
    }
  };

  // Calculate total score
  useEffect(() => {
    console.log(`Requesting: http://localhost:8000/api/scores/${gapId}/${elementName}/`);
    axios.get(`http://localhost:8000/api/scores/${gapId}/${elementName}/`)
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
  }, [gapId, elementName]);

  //fetch data of pie chart
  useEffect(() => {
    axios.get(`http://localhost:8000/api/element-scores/${gapId}/${elementName}/`)
      .then(response => {
        setPieData(response.data);
      })
      .catch(error => {
        console.error("Error fetching element scores:", error);
      });
  }, [gapId, elementName]);
  
  useEffect(() => {
    if(userRole === 'client'){
      window.history.pushState(null, null, window.location.href);
      window.onpopstate = function () {
        window.history.go(1);
      };
    }
  }, [userRole]);

  //Navbar
  const linksForPage3 = [
    { name: 'Overall Results', path: `/overall-output?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}`, image: '/back-button.png' },
    { name: 'Section 1', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Section 1')}` },
    { name: 'Section 2', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Section 2')}` },
    { name: 'Section 3', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Section 3')}` },
    { name: 'Section 4', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Section 4')}` },
    { name: 'Section 5', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Section 5')}` },
    { name: 'Section 6', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Section 6')}` },
    { name: 'Section 7', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Section 7')}` },
    { name: 'Section 8', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Section 8')}` },
    { name: 'Section 9', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Section 9')}` },
    { name: 'Section 10', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Section 10')}` },
    { name: 'Section 11', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Section 11')}` },
    { name: 'Section 12', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Section 12')}` },
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
            <div className="upper">Exceptional Compliance <span>(Score 5)</span></div>
            <div class="lower">{scores.exceptionalCompliance}</div>
          </div>
          <div className="block detail-good-compliance">
            <div className="upper">Good Compliance <span>(Score 4)</span></div>
            <div className="lower">{scores.goodCompliance}</div>
          </div>
          <div className="block detail-basic-compliance">
            <div className="upper">Basic Compliance <span>(Score 3)</span></div>
            <div className="lower">{scores.basicCompliance}</div>
          </div>
          <div className="block detail-needs-improvement">
            <div className="upper">Needs Improvement <span>(Score 2)</span></div>
            <div className="lower">{scores.needsImprovement}</div>
          </div>
          <div className="block detail-unsatisfactory">
            <div className="upper">Unsatisfactory <span>(Score 1)</span></div>
            <div className="lower">{scores.unsatisfactory}</div>
          </div>
        </div>

        {/* Pie Chart Placeholder */}
        <div className="pie-chart">
          <PieChart chartData={pieData}/>
          <ChartTable data={pieData}/>
        </div>

        <button className="previous-button" onClick={handlePrevious}>&lt;</button>
        <button className="next-button" onClick={handleNext}>&gt;</button>
      </div>
      </div>
  );
}

export default DetailScore;
