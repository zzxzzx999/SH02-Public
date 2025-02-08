import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import '../css/ListofCompany.css';
import '../css/NavBar.css';
import NavBar from './NavBar.js';

function ListofCompany(){
    const linksForPage2 = [
        { name: 'Previous Page', path: '/home' , image:'/back-button.png'},
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
    
    //backendlink
    useEffect(() => {const token = localStorage.getItem("authToken");
        axios.get("http://localhost:8000/api/companies/", {
            headers: {
                Authorization: `Token ${token}`,
            }
        }).then((response) => {setCompanies(response.data);})
    .catch((error) => {console.error("Error :", error.response || error.message);

    });}, []);

    
    
    //filter bar
    const filteredCompanies = companies.filter((company) => {
        const matchesFilter =
            (filter === "No GAP Analysis" && company.score <= 0) ||
            (filter === "Already Analysis" && company.score > 0) ||
            filter === ""; 
        const matchesSearch = company.name.toLowerCase().includes(searchKeyword.toLowerCase()); // search and match logic
        return matchesFilter && matchesSearch;
      });
    
    //sort bar
    const sortedCompanies = [...filteredCompanies].sort((a, b) => {
        if (sort === "Score High to Low") return b.score - a.score;
        if (sort === "Score Low to High") return a.score - b.score;
        if (sort === "Earliest Registered") return new Date(a.date) - new Date(b.date);
        if (sort === "Latest Registered") return new Date(b.date) - new Date(a.date);
        return 0;
      });

    //delete pop up
    const handleDeleteClick = (company) => {
        setDeleteTarget(company);
        setShowPopup(true); // show pop up
      };

    const confirmDelete = () => {
        setCompanies(companies.filter((c) => c.id !== deleteTarget.id));
        setShowPopup(false); // hide pop up
        setDeleteTarget(null);
      };
    
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
                    <svg width="18" height="18" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.09336 6L3.51836 4.425C3.39336 4.525 3.24961 4.60417 3.08711 4.6625C2.92461 4.72083 2.75169 4.75 2.56836 4.75C2.11419 4.75 1.72982 4.59271 1.41523 4.27813C1.10065 3.96354 0.943359 3.57917 0.943359 3.125C0.943359 2.67083 1.10065 2.28646 1.41523 1.97188C1.72982 1.65729 2.11419 1.5 2.56836 1.5C3.02253 1.5 3.4069 1.65729 3.72148 1.97188C4.03607 2.28646 4.19336 2.67083 4.19336 3.125C4.19336 3.30833 4.16419 3.48125 4.10586 3.64375C4.04753 3.80625 3.96836 3.95 3.86836 4.075L5.44336 5.65L5.09336 6ZM2.56836 4.25C2.88086 4.25 3.14648 4.14062 3.36523 3.92188C3.58398 3.70312 3.69336 3.4375 3.69336 3.125C3.69336 2.8125 3.58398 2.54688 3.36523 2.32812C3.14648 2.10938 2.88086 2 2.56836 2C2.25586 2 1.99023 2.10938 1.77148 2.32812C1.55273 2.54688 1.44336 2.8125 1.44336 3.125C1.44336 3.4375 1.55273 3.70312 1.77148 3.92188C1.99023 4.14062 2.25586 4.25 2.56836 4.25Z" fill="#1D1B20"/>
                    </svg>
                    </div>
                    <input type="text"
                            className="search-input"
                            placeholder="Search Company List"
                            value={searchKeyword}
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
                            <svg width="21" height="21" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_819_723)">
                                <path d="M8.96403 1.6875H1.67236L4.58903 5.43208V8.02083L6.04736 8.8125V5.43208L8.96403 1.6875Z" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_819_723">
                                    <rect width="8.75" height="9.5" fill="white" transform="translate(0.943359 0.5)"/>
                                </clipPath>
                                </defs>
                            </svg>
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
                        <svg width="21" height="21" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_819_727)">
                            <path d="M1.73486 9.46871V6.47913" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M1.73486 4.77083V1.78125" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4.31836 9.46875V5.625" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4.31836 3.91667V1.78125" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6.90186 9.46879V7.33337" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6.90186 5.625V1.78125" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M0.766113 6.47913H2.70361" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M3.34961 3.91663H5.28711" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M5.93311 7.33337H7.87061" stroke="black" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_819_727">
                            <rect width="7.75" height="10.25" fill="white" transform="translate(0.443359 0.5)"/>
                            </clipPath>
                            </defs>
                        </svg>
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
                            <Link to={`/registed-company?company=${company.name}`}>{company.name}</Link>
                        </span>
                        <span className="delete-column">
                        <button
                            className="delete-button"
                            onClick={() => handleDeleteClick(company)}
                           >
                            Delete
                            </button>
                        </span>
                            
                        <span className="score-column">{company.score}</span>
                        <span className="date-column">{company.date}</span>
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
