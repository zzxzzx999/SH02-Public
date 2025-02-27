import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from 'react-router-dom';
import '../css/ListofCompany.css';
import '../css/NavBar.css';
import NavBar from './NavBar.js';

function ListofCompany(){
    const linksForPage2 = [
        { name: 'Add New Company', path: '/new-company' , image:'/add-new-company.png'},
        
      ];

    const[filterVisible, setFilterVisible]= useState(false);
    const[sortVisible, setSortVisible]=useState(false);
    const[showPopup, setShowPopup]= useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // save ID of deleted company
    const [companies, setCompanies] = useState([]);
    const[filter, setFilter]= useState("");
    const [sort, setSort] = useState("");    // current sort condition
    const [searchKeyword, setSearchKeyword] = useState(""); 
    const [scores, setScores] = useState({});
    const [searchParams] = useSearchParams();
    const [, setGapId] = useState(null);
    const [analyses, setAnalyses] = useState([])
    
    
    //backendlink
    const fetchCompanies = () => {
        const token = localStorage.getItem("authToken");
        axios
          .get("http://localhost:8000/api/companies/", {
            headers: { Authorization: `Token ${token}` },
          })
          .then((response) => {
            setCompanies(
                response.data.map((company) => ({
                    
                    name: company.name,
                    score: 0,
                    dateRegistered: company.dateRegistered,
                }))
            );
        })
          .catch((error) => console.error("Error:", error));
      };
    
    useEffect(fetchCompanies, []);

     // Fetch the latest analysis for each company
     useEffect(() => {
        companies.forEach((company) => {
            fetch(`http://localhost:8000/api/past_analyses/${encodeURIComponent(company.name)}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.past_analyses.length > 0) {
                        const latestAnalysis = data.past_analyses[0]; // Get the latest analysis
                        setAnalyses((prevAnalyses) => ({
                            ...prevAnalyses,
                            [company.name]: latestAnalysis, // Store the latest analysis for this company
                        }));
                    }
                })
                .catch((error) => console.error("Error fetching analysis:", error));
        });
    }, [companies]);
    
    // get the latest analysis score of each company
    useEffect(() => {
        // get company list
        fetch("http://localhost:8000/api/companies")
            .then((res) => res.json())
            .then((data) => {
                setCompanies(data); 
                // get total_score of latest analysis of each company 
                data.forEach(company => {
                    fetch(`http://localhost:8000/api/company-latest-total-score/${encodeURIComponent(company.name)}`)
                        .then((res) => res.json())
                        .then((scoreData) => {
                            setScores(prevScores => ({
                                ...prevScores,
                                [company.name]: scoreData.score || 0
                            }));
                        })
                        .catch(error => console.error("Error fetching score:", error));
                });
            })
            .catch(error => console.error("Error fetching companies:", error));
    }, []);
    
    //filter bar
    const filteredCompanies = companies.map((company) => ({
        ...company,
        score: scores[company.name] ?? 0, // make sure score is assigned value correctly
    })).filter((company) => {
        const matchesFilter =
            (filter === "No GAP Analysis" && company.score <= 0) ||
            (filter === "Already Analysis" && company.score > 0) ||
            filter === ""; 
        const matchesSearch = company.name.toLowerCase().includes(searchKeyword.toLowerCase());
        return matchesFilter && matchesSearch;
    });
    
    //sort bar
    const sortedCompanies = [...filteredCompanies].sort((a, b) => {
        const scoreA = scores[a.name] ?? -1;
        const scoreB = scores[b.name] ?? -1;
    
        if (sort === "Score High to Low") return scoreB - scoreA;
        if (sort === "Score Low to High") return scoreA - scoreB;
        
        if (sort === "Earliest Registered") {
            return new Date(a.dateRegistered) - new Date(b.dateRegistered);
        }
        if (sort === "Latest Registered") {
            return new Date(b.dateRegistered) - new Date(a.dateRegistered);
        }
        return 0;
    });

    useEffect(() => {
        setCompanies((prevCompanies) =>
            prevCompanies.map((company) => ({
                ...company,
                score: scores[company.name] ?? 0, 
            }))
        );
    }, [scores]);


    useEffect(() => {
        const currentGapId = searchParams.get("gap_id");
        if (currentGapId) {
            const selectedAnalysis = analyses.find(a => a.gap_id === parseInt(currentGapId, 10));
            if (selectedAnalysis) {
                setGapId(selectedAnalysis.gap_id); // save gap_id
            }
        } else {
            setGapId(null);
        }
    }, [searchParams, analyses]);

    //delete pop up
    const handleDeleteClick = (company) => {
        console.log(company); 
        if (company && company.name) {
            setDeleteTarget(company);  
            setShowPopup(true); 
        } else {
            console.error("Company ID is missing");
        };}

    const confirmDelete = () => {
            const token = localStorage.getItem("authToken"); 
            axios
                .delete(`http://localhost:8000/api/companies/${deleteTarget.name}/delete/`, {
                    headers: { Authorization: `Token ${token}` },
                })
                .then(() => {
                    setCompanies((prevCompanies) =>
                        prevCompanies.filter((c) => c.name !== deleteTarget.name));
                    setShowPopup(false);
                    setDeleteTarget(null);
                })
                .catch((error) => {
                    console.error("Error during deletion:", error);
                    alert("Failed to delete the company. Please try again.");
            });} 
            
    
    const cancelDelete = () => {
        setShowPopup(false);  
        setDeleteTarget(null);
      };

    return(
        <div class="main-content">
             <NavBar links={linksForPage2} logout={true} />
            <div className="bubble-container-list">
                <h1 className='title'>List of Companies</h1>
               
                <div className="search-part">
                {/* serach-part */}
                <div className="search-wrapper">
                    <div className="search-icon">
                        <img src="/search-icon.svg" alt="Search Icon" />
                    </div>
                    <input type="text" className="search-input" placeholder="Search Company List" value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)} />  
                </div>
                

                {/* filter-part */}
                <div className="filter-wrapper">
                    <button className="filter-button" onClick={() => setFilterVisible(!filterVisible)}>Filter</button>
                    {filterVisible && (
                        <div className="dropdown">
                            <button 
                                onClick={() => setFilter((prev) => prev === "No GAP Analysis" ? "" : "No GAP Analysis")}>
                                {filter === "No GAP Analysis" ? "Clear Filter" : "No GAP Analysis"}
                            </button>
                            <button 
                                onClick={() => setFilter((prev) => prev === "Already Analysis" ? "" : "Already Analysis")}>
                                {filter === "Already Analysis" ? "Clear Filter" : "Already Analysis"}
                            </button>
                        </div>
                    )}
                        <div className="filter-icon"> 
                            <img src="/filter-icon.svg" alt="Filter Icon" />
                        </div>
                </div>
                

                {/* sort-part */}
                <div className="sort-wrapper">
                    <button className="sort-button" onClick={() => setSortVisible(!sortVisible)}>Sort</button>
                    {sortVisible && (
                        <div className="dropdown">
                            <button onClick={() => setSort("Score High to Low")}>
                                Score High to Low
                            </button>
                            <button onClick={() => setSort("Score Low to High")}>
                                Score Low to High
                            </button>
                            <button onClick={() => setSort("Earliest Registered")}>
                                Earliest Registered
                            </button>
                            <button onClick={() => setSort("Latest Registered")}>
                                Latest Registered
                            </button>
                        </div>
                        )}
                    <div className="sort-icon">
                        <img src="/sort-icon.svg" alt="Sort Icon" />
                    </div>
                </div>     
            </div>

                {/* Main table part */}
                <div className='table'>
                    <div className='table-header'>
                    <span>Company Name</span>
                    <span>Score</span>
                    <span>Date Registered</span>
                    </div>

                      {/*company list*/}
                    {/*React usually use map to iterator the company datas*/}
                    {sortedCompanies.map((company) => (
                        <div key={company.name} className="table-row">
                        <span className="company-name">
                        <Link to={`/registed-company?company=${encodeURIComponent(company.name)}&gap_id=${analyses[company.name]?.gap_id || ""}`}
                                >{company.name}</Link>
                        </span>
                            
                        <span className="score-column">{scores[company.name]|| ''}</span>
                        <span className="date-column">{new Date(company.dateRegistered).toLocaleDateString()}</span>
                        <span className="delete-column">
                            <button className="delete-button" onClick={() => handleDeleteClick(company)}>
                                Delete
                            </button>
                        </span>
                        </div>
                    ))}
                    
                </div>
                {showPopup && (
                            <div className="popup-overlay">
                            <div className="popup-content">
                                <h2>Notice!</h2>
                                <p>Are you sure you want to delete '{deleteTarget?.name}'?</p>
                                <div className="popup-buttons">
                                    <button className="popup-yes" onClick={confirmDelete}>
                                        Yes
                                    </button>
                                    <button className="popup-no" onClick={cancelDelete}>
                                        No
                                    </button>
                                </div>
                            </div>
                            </div>
                        )}
            </div>
            </div>
     
    
    );
}

export default ListofCompany;
