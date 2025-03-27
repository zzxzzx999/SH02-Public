import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import '../css/NavBar.css';
import '../css/OverallOutput.css';
import NavBar from "./NavBar.js";
import BarChart from "./charts/BarPotential.js";
import LineChart from "./charts/LinePotential.js";

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
            })
            .catch(error => {console.error("Error fetching bar chart data:", error.message);});
          }
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
    
  //prevent back to previous page when is not admin
  useEffect(() => {
    if(userRole === 'client'){
      try{
      window.history.pushState(null, null, window.location.href);
      window.onpopstate = function () {
        window.history.go(1);
      };
      } catch (error){
      console.error("Error when trying to push state:", error);
      }
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
