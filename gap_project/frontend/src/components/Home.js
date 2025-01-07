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
import debounce from 'lodash/debounce'; //debounce to prevent search everytime searchText changes

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

  return (
    <div className="main-content">
      <NavBar links={linksForPage1} logout={true}/> {/* Passing the links to the Navbar component */}
      <div className="about-us-search">
        <h2>Search for Company</h2>
        <input type="search" placeholder="search for company" value={searchText} onChange={e => setSearchText(e.target.value)} onKeyDown={handleKeyDown}/>
        <ul>
          {Array.isArray(data) && data.length > 0 ? (
          data.map((company) => (
              <li key={company.name}>{company.name}</li>
          ))
          ) : (
          <li>No companies found</li>
          )}
        </ul>
      </div>
      <div className="about-us-box">
        <h1>About Us</h1>
        <p>
        Gordon-Foley Consulting are a health and safety consultancy business, who work with a range of clients across different industrial sectors. 
        The client range are largely in the SME category with a small number of large multi-national organisations using our services. 
        <br></br><br></br><br></br>
        The services we provide to you include and are not limited to:<br></br>
          - Health and Safety Advice and support<br></br>
          - Health and safety Inspections<br></br>
          - Health and Safety Training<br></br>
        </p>
      </div>
    </div>
  );
}

export default AboutUs;