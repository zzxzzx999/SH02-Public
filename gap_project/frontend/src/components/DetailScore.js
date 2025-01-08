import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../css/DetailScore.css';
import '../css/NavBar.css';
import NavBar from "./NavBar";


function DetailScore() {
  const { companyName } = useParams(); 

  // Example scores
  const [exceptionalCompliance, setExceptionalCompliance] = useState(10);
  const [goodCompliance, setGoodCompliance] = useState(8);
  const [basicCompliance, setBasicCompliance] = useState(6);
  const [needsImprovement, setNeedsImprovement] = useState(4);
  const [unsatisfactory, setUnsatisfactory] = useState(2);
  const [totalScore, setTotalScore] = useState(0);

  // Calculate total score
  useEffect(() => {
    const newTotalScore =
      exceptionalCompliance +
      goodCompliance +
      basicCompliance +
      needsImprovement +
      unsatisfactory;
    setTotalScore(newTotalScore); // Update the state
  }, [exceptionalCompliance, goodCompliance, basicCompliance, needsImprovement, unsatisfactory]);
  
  const linksForPage3 = [
    { name: 'Previous Page', path: `/overall-output/${companyName}` , image:'/back-button.png'}, 
  ]
  
  return (
    <div class="main-content">
      <NavBar links={linksForPage3} />
      <div className="detail-output-container">
        {/* Header with Title and Total Score */}
        <div className="header">
          <h1>H&S POLICY</h1>
          <span id="total-score">{totalScore}/50</span>
        </div>

        {/* Compliance Scores */}
        <div className="compliance-scores">
          <div className="block detail-exceptional-compliance">
            <div class="upper">Exceptional Compliance <span>(Score 5)</span></div>
            <div class="lower">{exceptionalCompliance}</div>
          </div>
          <div className="block detail-good-compliance">
            <div class="upper">Good Compliance <span>(Score 4)</span></div>
            <div class="lower">{goodCompliance}</div>
          </div>
          <div className="block detail-basic-compliance">
            <div class="upper">Basic Compliance <span>(Score 3)</span></div>
            <div class="lower">{basicCompliance}</div>
          </div>
          <div className="block detail-needs-improvement">
            <div class="upper">Needs Improvement <span>(Score 2)</span></div>
            <div class="lower">{needsImprovement}</div>
          </div>
          <div className="block detail-unsatisfactory">
            <div class="upper">Unsatisfactory <span>(Score 1)</span></div>
            <div class="lower">{unsatisfactory}</div>
          </div>
        </div>

        {/* Pie Chart Placeholder */}
        <div className="pie-chart">[Chart Placeholder]</div>
      </div>
      </div>
  );
}

export default DetailScore;
