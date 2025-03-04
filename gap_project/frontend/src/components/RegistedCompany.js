import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import '../css/NavBar.css';
import "../css/RegistedCompany.css";
import NavBar from "./NavBar.js";
import BarChart from "./charts/BarChart.js";
import LineChart from "./charts/LineChart.js";
import LineChartWithBackground from "./charts/LineChartWithBg.js";
import { pdfDownload } from "./PfPlan.js";

function RegistedCompany() {
    const linksForPage3 = [
        { name: 'Previous Page', path: '/list-of-company' , image:'/back-button.png'},
    ];

    const location = useLocation();  // get current URL info
    const params = new URLSearchParams(location.search);  // get and query para
    const companyName = params.get('company');
    const [title, setTitle] = useState("Overview");
    const [gapId, setGapId] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate(); 
    const [companyNotes, setCompanyNotes]=useState('')
    const [url, setUrl]=useState('')
    const [analyses, setAnalyses] = useState([])
    const [PDFTitle, setPDFTitle] = useState(null);

    // State for chart data
    const [barData, setBarData] = useState({
        categories: [],
        values: [],
    });
    const [lineData, setLineData] = useState({
        categories: [],
        values: [],
    });
    const [lineBgData, setLineBgData] = useState({
        categories: [],
        values: [],
    });

    useEffect(() => {
        document.title = title; // set page's title as title in URL
    }, [title]);  

    // Fetch company notes
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/companies/?name=${encodeURIComponent(companyName)}`)
        .then(r => r.json())
        .then(d => setCompanyNotes(d[0].notes));
    }, [companyName]);

    // Fetch past analyses
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/past_analyses/${encodeURIComponent(companyName)}`)
            .then(response => response.json())
            .then(data => {
                setAnalyses(data.past_analyses);
                if (data.past_analyses.length > 0) {
                    const latestAnalysis = data.past_analyses[0];
                    if (!searchParams.get("gap_id")) {
                        // Set the latest analysis as default
                        setSearchParams({ company: companyName, gap_id: latestAnalysis.gap_id });
                        setTitle(`Overview (${latestAnalysis.date})`); // Set title for the latest analysis
                        setGapId(latestAnalysis.gap_id);
                        setUrl(latestAnalysis.url);
                    }
                }
            })
            .catch(error => console.error("Error fetching data:", error));
    }, [companyName, searchParams, setSearchParams]);

    useEffect(() => {
        const currentGapId = searchParams.get("gap_id");
        if (currentGapId) {
            const selectedAnalysis = analyses.find(a => a.gap_id === parseInt(currentGapId, 10));
            if (selectedAnalysis) {
                // Check if the selected analysis is the latest one
                if (analyses.length > 0 && selectedAnalysis.gap_id === analyses[0].gap_id) {
                    setTitle(`Overview (${selectedAnalysis.date})`); // Latest analysis
                } else {
                    setTitle(selectedAnalysis.date); // Other analyses
                }
                setGapId(selectedAnalysis.gap_id); // save gap_id
                setUrl(selectedAnalysis.url);
                const pdfTitle = companyName + "-" + selectedAnalysis.date
                console.log("date: " + selectedAnalysis.date)
                setPDFTitle(pdfTitle)
            }
        } else {
            setTitle("Overview");
            setGapId(null);
        }
    }, [searchParams, analyses, companyName]);

    // Fetch chart data based on gap_id
    useEffect(() => {
        const currentGapId = searchParams.get("gap_id");
        if (currentGapId) {
            // Fetch bar chart data
            fetch(`${process.env.REACT_APP_BACKEND_URL}/analysis/${currentGapId}/bar-chart-data`)
                .then(response => response.json())
                .then(data => {
                    setBarData({
                        categories: data.categories || [],
                        values: data.values || [],
                    });
                })
                .catch(error => console.error("Error fetching bar chart data:", error));
            // Fetch line chart data
            fetch(`${process.env.REACT_APP_BACKEND_URL}/analysis/${encodeURIComponent(companyName)}/total-score-over-time`)
                .then(response => response.json())
                .then(data => {
                    setLineData({
                        categories: data.gap_date || [],
                        values: data.total_score || [],
                    });
                })
                .catch(error => console.error("Error fetching line chart data:", error));

            // Fetch line chart with background 
            fetch(`${process.env.REACT_APP_BACKEND_URL}/analysis/${currentGapId}/bar-chart-data`)
                .then(response => response.json())
                .then(data => {
                    setLineBgData({
                        categories: data.categories || [],
                        values: data.values || [],
                    });
                })
                .catch(error => console.error("Error fetching line chart with background data:", error));
        }
    }, [searchParams, companyName]);

    console.log(PDFTitle);

    return(
        <div class="main-content">
        <NavBar links={linksForPage3}  logout={true}/>
        <div className="overview-container">
            <aside className="left-part">
                <h2>{companyName}</h2>
                <div className="company-info">  
                    <p>
                    {companyNotes|| "No additional notes."}
                    </p>
                </div>
                <div className="url-section"> 
                <h2>Evidence URL</h2> 
                {url === "no url given" ? (
                    <p className="no-url">No URL provided</p>
                ) : (
                    <a href={url} className="url-link" target="_blank" rel="noopener noreferrer">
                    {url}
                    </a>
                )}
                </div>
                <div className="past-gap">
                <h2>Past GAP Analysis</h2>
                    <div className="analysis-list">
                        <ul>
                        {analyses.length > 0 && (
                            <li>
                                <Link to={`/registed-company?company=${encodeURIComponent(companyName)}&gap_id=${analyses[0].gap_id}`}
                                   >
                                    Overview ({analyses[0].date})  
                                </Link>
                            </li>
                        )}
                            {analyses.slice(1).map(analysis => (
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
                        onClick={() => pdfDownload(gapId, PDFTitle)}
                        className="download-icon"
                    />
                </div>
                
                <div className="chart-bubble">   
                    {/* left part chart */}
                    <div className="left-chart">
                        <div className="chart-placeholder">
                            <h2>Summary of Sections</h2>
                            <div className="chart-box">
                                {gapId ? <BarChart chartData={barData}/> : <p>No gap data available now</p>}
                            </div>
                        </div>
                        <div className="chart-placeholder">
                            <h2>Benchmark Improvement</h2>
                            <div className="chart-box">
                                {gapId ? <LineChart chartData={lineData}/>: <p>No gap data available now</p>}
                            </div>
                        </div>
                    </div>

                    {/* right part chart */}
                    <div className="chart-placeholder large-chart">
                        <h2>Potential Score Comparison</h2>
                        <div className="chart-box">
                            {gapId ? <LineChartWithBackground chartData={lineBgData} /> : <p>No gap data available now</p>}
                        </div>
                    </div>
                    {/* View Full Analysis, only show when gapid exist*/}
                    {gapId && (
                        <div className="full-analysis">
                            <button onClick={() => navigate(`/overall-output?company=${encodeURIComponent(companyName)}&gap_id=${encodeURIComponent(gapId)}`)}>
                                View Full Analysis
                            </button>
                        </div>
                    )}
                </div>   
            </main>
        </div> 
        </div>
    );
}

export default RegistedCompany;
