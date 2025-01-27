import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import '../css/NavBar.css';
import "../css/RegistedCompany.css";
import NavBar from "./NavBar";
import BarChart from "./charts/BarChart";
import LineChart from "./charts/LineChart";
import LineChartWithBackground from "./charts/LineChartWithBg";

function RegistedCompany() {
    const linksForPage3 = [
        { name: 'Previous Page', path: '/list-of-company' , image:'/back-button.png'},
    ];

    const location = useLocation();  // get current URL info
    const params = new URLSearchParams(location.search);  // get and query para
    const companyName = params.get('company');
    const title = params.get('title') || 'Overview'; 

    const navigate = useNavigate(); 

    const handleDownload = () => {
        // achieve easy download function
        const link = document.createElement('a');
        link.href = '/path-to-your-file.pdf'; // replace to file path
        link.download = 'Analysis_Report.pdf'; // default name of download file
        link.click();
      };

    useEffect(() => {
        document.title = title; // set page's title as title in URL
    }, [title]);

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

    // Dummy data for line chart with background (to be changed)
    const [lineBgData] = useState({
        categories: ['Section 1', 'Section 2', 'Section 3', 'Section 4', 'Section 5', 'Section 6', 'Section 7', 'Section 8', 'Section 9', 'Section 10'],
        values: [2, 20, 15, 50, 34, 45, 30, 20, 10, 5],
    });

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
                        <li><Link to={`/registed-company?company=${encodeURIComponent(companyName)}`}>Overview</Link></li>
                        <li><Link to={`/registed-company?company=${encodeURIComponent(companyName)}&title=${encodeURIComponent('2024 Analysis')}`}>2024 Analysis</Link></li>
                        <li><Link to={`/registed-company?company=${encodeURIComponent(companyName)}&title=${encodeURIComponent('2023 Analysis')}`}>2023 Analysis</Link></li>                          
                        </ul>
                    </div>
                </div>
                
            </aside>

            <main className="right-part">
                {/* Overview title and download button */}
                <div className="o-d-section">
                    <div className="overview-bubble">
                        <h1>{title}</h1>
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
                            <div className="chart-box"><BarChart chartData={barData}/></div>
                        </div>
                        <div className="chart-placeholder">
                            <h2>Benchmark Improvement</h2>
                            <div className="chart-box"><LineChart chartData={lineData}/></div>
                        </div>
                    </div>

                    {/* right part chart */}
                    <div className="chart-placeholder large-chart">
                        <h2>Potential Score Comparison</h2>
                        <div className="chart-box"><LineChartWithBackground chartData={lineBgData}/></div>
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
