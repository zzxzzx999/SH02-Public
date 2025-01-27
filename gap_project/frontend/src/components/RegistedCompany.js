import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import '../css/NavBar.css';
import "../css/RegistedCompany.css";
import NavBar from "./NavBar";

function RegistedCompany() {
    const linksForPage3 = [
        { name: 'Previous Page', path: '/list-of-company' , image:'/back-button.png'},
    ];

    const location = useLocation();  // get current URL info
    const params = new URLSearchParams(location.search);  // get and query para
    const companyName = params.get('company');
    const title = params.get('title') || 'Overview'; 
    const gapId = params.get('gap_id')

    const navigate = useNavigate(); 
    const [companyNotes, setCompanyNotes]=useState('')

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

    useEffect(() => {
        const fetchCompanyNotes = async () => {
            try {
                const token = localStorage.getItem("authToken"); 
                const response = await fetch(`http://localhost:8000/api/companies/${encodeURIComponent(companyName)}/`,{
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCompanyNotes(data.notes);  // set notes data
            } catch (error) {
                console.error('Error fetching company notes:', error);
            }
        };

        if (companyName) {
            fetchCompanyNotes();
        }
    }, [companyName]);


    return(
        <div class="main-content">
        <NavBar links={linksForPage3} />
        <div className="overview-container">
            <aside className="left-part">
                <h2>{companyName}</h2>
                <div className="company-info">  
                    <p>
                    {companyNotes|| "No additional notes."}
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
                    {title !== 'Overview' && (
                        <div className="full-analysis">
                        <button onClick={() => navigate(`/overall-output?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}`)}>View Full Analysis</button>
                    </div> 
                    )}
                </div>   
            </main>
        </div> 
        </div>
    );
    
} 

export default RegistedCompany;
