//import { CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement } from 'chart.js';
//import { Line } from 'react-chartjs-2'; 
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import '../css/NavBar.css';
import '../css/OverallOutput.css';
import NavBar from "./NavBar.js";
import LineChart from "./charts/LineChart.js";
import BarChart from "./charts/BarChart.js";

// registe Chart.js
//ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

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

    // cal total score
    useEffect(() => {
      axios.get(`http://localhost:8000/api/overall-scores/${companyName}/`)
        .then((response) => {
          console.log( response.data);
          const { totals, percentages, total_score } = response.data;
          setTotalScore(total_score)
          setPercentages(percentages)
        })
    
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });
}, [companyName]);

const linksForPage3 = [
  { name: 'Previous Page', path: `/registed-company?company=${encodeURIComponent(companyName)}`, image: '/back-button.png' },
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

// Dummy data for bar chart (to be changed)
const [barData] = useState({
  categories: ['Section 1', 'Section 2', 'Section 3', 'Section 4', 'Section 5', 'Section 6', 'Section 7', 'Section 8', 'Section 9', 'Section 10'],
  values: [2, 20, 15, 50, 34, 45, 30, 20, 10, 5],
});

// Dummy data for line chart (to be changed)
const [lineData] = useState({
  categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  values: [120, 200, 150, 80, 70, 110, 130],
});
  
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
              <h2>Score over Time (Potential)</h2>
              <div className="overall-output-chart-placeholder"><LineChart chartData={lineData}/></div>
            </div>
            
            {/* Right small chart */}
            <div className="chart-container small-chart">
              <h2>Score over Time (Potential)</h2>
              <div className="overall-output-chart-placeholder"><BarChart chartData={barData}/></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  

export default OverallOutput;
