import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../css/Home.css';
import '../css/NavBar.css';
import NavBar from './NavBar.js';

const url = 'http://127.0.0.1:8000/api'

function AboutUs() {
  const linksForPage1 = [
    { name: 'Add New Company', path: '/new-company' , image:'/add-new-company.png'},
  ];

  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState('')

  const fetchData = async() => {
    //dont fetch if search bar is empty
    if (searchText.trim() === '') {
      setData([]);
      return;
    }
    
    const endpoint = `${url}/companies/?name=${searchText}`

    try {
      const response = await fetch (endpoint, {method: 'GET'})
      const data = await response.json()
      console.log(data)

      if (Array.isArray(data)) {
        setData(data);
      } else {
          console.error("Expected an array but received:", data);
      }
      setData(data)
    }
    catch (e) {
      console.error("Error fetching data:", e);
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {  //check if the enter key was pressed
      fetchData();
    }
  };

  const clearSearch = () => {
    setSearchText('');  
    setData([]);   
  };

  console.log("company info: " + data);

  return (
    <div className="main-content">
      <NavBar links={linksForPage1} logout={true}/> {/* Passing the links to the Navbar component */}
      <div className="about-us-search">
        <h2 className = "search-text">Company Name</h2><br></br>
        <div className="search-box-and-results">
          <input 
            className="search-box" 
            type="search" placeholder="Search for company..." 
            value={searchText} onChange={e => 
            setSearchText(e.target.value)} 
            onKeyDown={handleKeyDown}
            />
          <button onClick={clearSearch} className="clear-button">Clear Results</button>
          {Array.isArray(data) && data.length > 0 ? (
          data.map((company) => (
            <div className="search-results">
              <p key={company.name}>{company.name}</p>
              {company.current_gap ? (
                <Link to={`/gap-analysis?company=${company.name}`} className="start-gap-link">
                  Resume GAP Analysis
                </Link>
              ) : (
                <Link to={`/new-gap-confirm?company=${company.name}`} className="start-gap-link">
                Start GAP Analysis
                </Link> //if company does not have an ongoing gap
              )}
            </div>
          ))
          ) : (
          <p className="search-results">No companies found</p>
          )}
        </div>
      </div>
      <div className="about-us-box">
        <h2>About Us</h2>
        <p>
        Company Content: 
        <br></br><br></br><br></br>
        The services:<br></br>
          - text<br></br>
          - text<br></br>
          - text<br></br>
          - text<br></br>
        </p>
      </div>
    </div>
  );
}

export default AboutUs;