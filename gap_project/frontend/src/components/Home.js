<<<<<<< HEAD
import React from "react";
import '../css/Home.css';
import '../css/NavBar.css';
import NavBar from './NavBar'; // Import the Navbar component
=======
import React, {useEffect, useState} from "react";
import NavBar from './NavBar'; 
import '../css/NavBar.css';
import '../css/Home.css';
import {Link } from "react-router-dom";

const url = 'http://127.0.0.1:8000/api'
>>>>>>> d54803e (basic search bar complete)

function AboutUs() {
  const linksForPage1 = [
    { name: 'Add New Company', path: '/new-company' , image:'/add-new-company.png'},
    { name: 'List of Company', path: '/list-of-company', image: '/company-list.png'}
  ];

  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState('')

  const fetchData = async() => {
    //dont fetch if search bar is empty
    if (searchText.trim() === '') {
      setData([]);
      return;
    }

    const token = localStorage.getItem("authToken");
    const endpoint = `${url}/companies/?name=${searchText}`

    try {
      const response = await fetch (endpoint, {
        method: 'GET'
      })

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

  return (
    <div className="main-content">
      <NavBar links={linksForPage1} logout={true}/> {/* Passing the links to the Navbar component */}
      <div className="about-us-search">
        <h2 className = "search-text">Search for Company to Start GAP Analysis</h2>
        <div className="search-box-and-results">
        <input className="search-box" type="search" placeholder="search for company" value={searchText} onChange={e => setSearchText(e.target.value)} onKeyDown={handleKeyDown}/>
        <button onClick={clearSearch} className="clear-button">Clear Results</button>
          {Array.isArray(data) && data.length > 0 ? (
          data.map((company) => (
              <div className="search-results">
                <p key={company.name}>Company name: {company.name}</p>
                <Link to={`/new-gap-confirm?company=${company.name}`} className="start-gap-link">Start GAP Analysis</Link>
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
        Gordon-Foley Consulting are a health and safety consultancy business, who work with a range of clients across different industrial sectors. 
        The client range are largely in the SME category with a small number of large multi-national organisations using our services. 
        <br></br><br></br><br></br>
        The services we provide to you include and are not limited to:<br></br>
          - Health and Safety Advice and support<br></br>
          - Health and Safety Inspections<br></br>
          - Health and Safety Training<br></br>
        </p>
      </div>
    </div>
  );
}

export default AboutUs;