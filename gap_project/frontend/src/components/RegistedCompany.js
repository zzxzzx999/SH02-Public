import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
    const [title, setTitle] = useState("Overview");
    const [gapId, setGapId] = useState(null);
    const [searchParams] = useSearchParams();

    const navigate = useNavigate(); 
    const [companyNotes, setCompanyNotes]=useState('')
    const [analyses, setAnalyses] = useState([])

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
        fetch(`http://localhost:8000/api/companies/?name=${encodeURIComponent(companyName)}`)
        .then(r => r.json())
        .then(d => setCompanyNotes(d[0].notes));
    }, [companyName]);


    useEffect(()=>{
        fetch(`http://localhost:8000/api/past_analyses/${encodeURIComponent(companyName)}`)
            .then(response =>response.json())
            .then(data => setAnalyses(data.past_analyses))
            .catch(error => console.error("Error fetching data:", error));
    }, [companyName]);

    useEffect(() => {
        const currentGapId = searchParams.get("gap_id");
        if (currentGapId) {
            const selectedAnalysis = analyses.find(a => a.gap_id === parseInt(currentGapId, 10));
            if (selectedAnalysis) {
                setTitle(selectedAnalysis.date);
                setGapId(selectedAnalysis.gap_id); // save gap_id
            }
        } else {
            setTitle("Overview");
            setGapId(null);
        }
    }, [searchParams, analyses]);


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
                            {analyses.map(analysis => (
                                <li key={analysis.gap_id}>
                                    <Link to={`/registed-company?company=${encodeURIComponent(companyName)}&gap_id=${analysis.gap_id}`}
                                    onClick={() => setTitle(analysis.date)} >
                                        {analysis.date}
                                    </Link>
                                </li>
                            ))}                          
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
                        <button onClick={() => navigate(`/overall-output?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}`)}>View Full Analysis</button> {/*&gap_id=${encodeURIComponent(gapId)} */}
                    </div> 
                    )}
                </div>   
            </main>
        </div> 
        </div>
    );
}

export default RegistedCompany;
