//import { CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement } from 'chart.js';
//import { Line } from 'react-chartjs-2'; 
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import '../css/NavBar.css';
import '../css/OverallOutput.css';
import NavBar from "./NavBar";

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
    const { companyName } = useParams(); 
    const location = useLocation();

      // exapmle data
    const categories = [
      {
        name: "H&S Policy",
        scores: { exceptional: 10, good: 8, basic: 6, needsImprovement: 4, unsatisfactory: 2 },
      },
      {
        name: "Training",
        scores: { exceptional: 5, good: 10, basic: 7, needsImprovement: 4, unsatisfactory: 3 },
      },
      {
        name: "Risk Management",
        scores: { exceptional: 6, good: 9, basic: 5, needsImprovement: 5, unsatisfactory: 5 },
      },
      {
        name: "Incident Reporting",
        scores: { exceptional: 7, good: 10, basic: 6, needsImprovement: 3, unsatisfactory: 4 },
      },
    ];

    // cal total score
    useEffect(() => {
      let total = 0; 
      const totals = { basic: 0, needsImprovement: 0, unsatisfactory: 0 }; 
      categories.forEach((category) => {
        const { scores } = category;
        totals.basic += scores.basic;
        totals.needsImprovement += scores.needsImprovement;
        totals.unsatisfactory += scores.unsatisfactory;
        total += Object.values(scores).reduce((a, b) => a + b, 0);
    });
    setTotalScore(total);

    setPercentages({
      basic: ((totals.basic / total) * 100).toFixed(2),
      needsImprovement: ((totals.needsImprovement / total) * 100).toFixed(2),
      unsatisfactory: ((totals.unsatisfactory / total) * 100).toFixed(2),
    });
  }, [companyName, location.pathname]);

    const linksForPage3 = [
      { name: 'Previous Page', path: `/registed-company/${companyName}` , image:'/back-button.png'}, 
      { name: 'Policy', path:  `/detail-score/${companyName}`},
      { name: 'Management', path:  `/detail-score/${companyName}`},
      { name: 'Documented', path:  `/detail-score/${companyName}`},
      { name: 'Meetings', path:  `/detail-score/${companyName}`},
      { name: 'performance Measurement', path:  `/detail-score/${companyName}`},
      { name: 'Committee & Representatives', path:  `/detail-score/${companyName}`},
      { name: 'Investiagtion Process', path:  `/detail-score/${companyName}`},
      { name: 'Incident Reporting', path:  `/detail-score/${companyName}`},
      { name: 'Training Plan', path:  `/detail-score/${companyName}`},
      { name: 'Risk Management Process', path:  `/detail-score/${companyName}`},
      { name: 'Audit & Inspection Process', path:  `/detail-score/${companyName}`},
      { name: 'Improvement Planning', path:  `/detail-score/${companyName}`},
      
    ];
  
    return (
      // force refresh
      <div key={location.pathname} class="main-content"> 
        <NavBar links={linksForPage3} />
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
              <div className="overall-output-chart-placeholder">[Chart Placeholder]</div>
            </div>
            
            {/* Right small chart */}
            <div className="chart-container small-chart">
              <h2>Score over Time (Potential)</h2>
              <div className="overall-output-chart-placeholder">[Chart Placeholder]</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  

export default OverallOutput;
