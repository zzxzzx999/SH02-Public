import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import '../css/NavBar.css';
import "../css/RegistedCompany.css";
import NavBar from "./NavBar";

function RegistedCompany() {
    const linksForPage3 = [
        { name: 'Previous Page', path: '/list-of-company' , image:'/back-button.png'},
    ];

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const companyName = params.get('company');

    const navigate = useNavigate(); 

    const handleDownload = () => {
        // achieve easy download function
        const link = document.createElement('a');
        link.href = '/path-to-your-file.pdf'; // replace to file path
        link.download = 'Analysis_Report.pdf'; // default name of download file
        link.click();
      };

    return(
        <div class="main-content">
        <NavBar links={linksForPage3} />
        <div className="overview-container">
            <aside className="left-part">
                <h2>{companyName}</h2>
                <div className="company-info">  
                    <p>
                    This is where the company description would be. This could contain relevant contact
                    information, the address of the company site, and any relevant information.
                    </p>
                </div>
                <div className="past-gap">
                <h2>Past GAP Analysis</h2>
                    <div className="analysis-list">
                        <ul>
                            <li>Overview</li>
                            <li>2024 Analysis</li>
                            <li>2023 Analysis</li>
                           
                        </ul>
                    </div>
                </div>
                
            </aside>

            <main className="right-part">
                {/* Overview title and download button */}
                <div className="o-d-section">
                    <div className="overview-bubble">
                    <h1>Overview</h1>
                    
                </div> 
                    <img
                        src="/download.png" 
                        alt="Download"
                        onClick={handleDownload}
                        className="download-icon"
                    />
                </div>
                
                <div className="chart-bubble">   
                    {/* left part chart */}
                    <div className="left-chart">
                        <div className="chart-placeholder">
                            <h2>Summary of Sections</h2>
                            <div className="chart-box">[Chart Placeholder]</div>
                        </div>
                        <div className="chart-placeholder">
                            <h2>Benchmark Improvement</h2>
                            <div className="chart-box">[Chart Placeholder]</div>
                        </div>
                    </div>

                    {/* right part chart */}
                    <div className="chart-placeholder large-chart">
                        <h2>Potential Score Comparison</h2>
                        <div className="chart-box">[Chart Placeholder]</div>
                    </div>
                    {/* View Full Analysis */}
                    <div className="full-analysis">
                        <button onClick={() => navigate(`/overall-output?company=${companyName}`)}>View Full Analysis</button>
                    </div>               
                </div>   
            </main>
        </div> 
        </div>
    );
    
} 

export default RegistedCompany;
