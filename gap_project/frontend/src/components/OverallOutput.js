import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import '../css/NavBar.css';
import '../css/OverallOutput.css';
import NavBar from "./NavBar";
import BarChart from "./charts/BarPotential";
import LineChart from "./charts/LinePotential";


function OverallOutput() {
    // store total score
    const [totalScore, setTotalScore] = useState(0);
    const [percentages, setPercentages] = useState({
      basic: 0,
      needsImprovement: 0,
      unsatisfactory: 0,
    });
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const companyName = params.get('company');
    const gapId = params.get('gap_id')
    const [searchParams] = useSearchParams();
    const userRole = localStorage.getItem("userRole");

    const [lineData, setLineData] = useState({
      categories: [],
      values: [],
  });

  const [barData, setBarData] = useState({
    categories: [],
    values: [],
});
  

    // cal total score
    useEffect(() => {
      if (!gapId) return;

      axios.get(`http://localhost:8000/api/overall-scores/${gapId}/`)
        .then((response) => {
          console.log( response.data);
          const { percentages, total_score } = response.data;
          setTotalScore(total_score)
          setPercentages(percentages)
        })
    
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });
}, [companyName,gapId]);

const commonLinks = [
  { name: 'Policy', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Policy')}` },
  { name: 'Management', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Management')}` },
  { name: 'Documented System', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Documented System')}` },
  { name: 'Meetings', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Meetings')}` },
  { name: 'Performance Measurement', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Performance Measurement')}` },
  { name: 'Committee & Representatives', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Committee & Representatives')}` },
  { name: 'Investigation Process', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Investigation Process')}` },
  { name: 'Incident Reporting', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Incident Reporting')}` },
  { name: 'Training Plan', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Training Plan')}` },
  { name: 'Risk Management Process', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Risk Management Process')}` },
  { name: 'Audit & Inspection Process', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Audit & Inspection Process')}` },
  { name: 'Improvement Planning', path: `/detail-score?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}&title=${encodeURIComponent('Improvement Planning')}` },
];
const linksForPage3 = [
  userRole === 'admin'
    ? { name: 'Registered Company', path: `/registed-company?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}`, image: '/back-button.png' }
    : { name: 'Home Page', path: `/home`, image: '/back-button.png' },
  ...commonLinks
];

// fetch data for bar chart 
useEffect(() => {
  let currentGapId = searchParams.get("gap_id");
  if (currentGapId) {
      // Fetch bar chart data
      fetch(`http://localhost:8000/api/analysis/${currentGapId}/bar-chart-data`)
          .then(response => response.json())
          .then(data => {
              setBarData({
                  categories: data.categories,
                  values: data.values,
              });
          })}
      }, [searchParams]);

// fetch data for line chart 
useEffect(() => {
  if (companyName) {
      // Fetch line chart data
      fetch(`http://localhost:8000/api/analysis/${encodeURIComponent(companyName)}/total-score-over-time/`)
          .then(response => response.json())
          .then(data => {
              setLineData({
                  categories: data.gap_date,
                  values: data.total_score, 
              });
          })
          .catch(error => console.error("Error fetching line chart data:", error));
  }
}, [companyName]);
  
useEffect(() => {
  if(userRole === 'client'){
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  }
}, [userRole]);
    return (
      // force refresh
      <div key={location.pathname} class="main-content" className="gap-intro"> 
        <NavBar links={linksForPage3} logout={true} />
        <div className="output-container">
          
          {/* Top Score Blocks */}
          <div className="score-blocks">
            <div className="score-block total-score">
              <h2>Total Score: </h2>
              <span>{totalScore}/600</span>
            </div>
            <div className="score-block unsatisfactory">
              <h2>UNSATISFACTORY</h2>
              <span>{percentages.unsatisfactory}% of Total Score</span>
            </div>
            <div className="score-block needs-improvement">
              <h2>NEEDS IMPROVEMENT</h2>
              <span>{percentages.needsImprovement}% of Total Score</span>
            </div>
            <div className="score-block basic-compliance">
              <h2>BASIC COMPLIANCE</h2>
              <span>{percentages.basic}% of Total Score</span>
            </div>
          </div>
  
          {/* Chart Section */}
          <div className="charts">
            {/* Left large chart */}
            <div className="chart-container overall-large-chart">
              <h2>Benchmark Improvement</h2>
              <div className="overall-output-chart-placeholder"><LineChart chartData={lineData} potentialScore={600}/></div>
            </div>
            
            {/* Right small chart */}
            <div className="chart-container small-chart">
              <h2>Summary of Sections</h2>
              <div className="overall-output-chart-placeholder"><BarChart chartData={barData} potentialScore={50}/></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  

export default OverallOutput;
