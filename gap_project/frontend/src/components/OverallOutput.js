//import { CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement } from 'chart.js';
//import { Line } from 'react-chartjs-2'; 
import axios from "axios";
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
    const [categories, setCategories] = useState([]); // API fetched categories
    const { companyName } = useParams(); 
    const location = useLocation();

    // cal total score
    useEffect(() => {
      axios.get(`http://localhost:8000/api/overall-scores/${companyName}/`)
        .then((response) => {
          console.log( response.data);
          const { totals, percentages, total_score } = response.data;
          setCategories(Object.entries(totals))
          setTotalScore(total_score)
          setPercentages(percentages)
        })
    
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });
}, [companyName]);

    const linksForPage3 = [
      { name: 'Previous Page', path: `/registed-company/${companyName}` , image:'/back-button.png'}, 
      { name: 'Policy', path:  `/detail-score/${companyName}?title=Policy`},
      { name: 'Management', path:  `/detail-score/${companyName}?title=Management`},
      { name: 'Documented', path:  `/detail-score/${companyName}?title=Document`},
      { name: 'Meetings', path:  `/detail-score/${companyName}?title=Meeting`},
      { name: 'Performance Measurement', path:  `/detail-score/${companyName}?title=Performance Measurement`},
      { name: 'Committee & Representatives', path:  `/detail-score/${companyName}?title=Committee & Representatives`},
      { name: 'Investiagtion Process', path:  `/detail-score/${companyName}?title=Investiagtion Process`},
      { name: 'Incident Reporting', path:  `/detail-score/${companyName}?title=Incident Reporting`},
      { name: 'Training Plan', path:  `/detail-score/${companyName}?title=Training Plan`},
      { name: 'Risk Management Process', path:  `/detail-score/${companyName}?title=Risk Management Process`},
      { name: 'Audit & Inspection Process', path:  `/detail-score/${companyName}?title=Audit & Inspection Process`},
      { name: 'Improvement Planning', path:  `/detail-score/${companyName}?title=Improvement Planning`}, 
      
    ];
  
    return (
      // force refresh
      <div key={location.pathname} class="main-content" className="gap-intro"> 
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
