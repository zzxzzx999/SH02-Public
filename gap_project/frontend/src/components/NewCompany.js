import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from './NavBar';  // Import the Navbar component
import '../css/Login.css'

function NewCompany() {
  const linksForPage2 = [
    { name: 'Previous Page', path: '/about-us', image:'/back-button.png'},
  ];

  const [companyName, setCompanyName] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const navigate = useNavigate(); 

  const handleSubmit = (event) => {
      event.preventDefault();
      navigate('/new-gap-confirm');
  }

  return (
  <div className="create-new-company">
  <NavBar links={linksForPage2} />;
  <div className = "bubble-container" style={{width:'500px'}}>
  <h2>CREATE NEW COMPANY</h2>
  <form onSubmit={handleSubmit} className="form">
      <label>
      <input 
          type="text" 
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder = "Company Name"
      />
      </label>

      <label> 
      <textarea
          type="text" 
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder = "Additional Notes"
      />
      </label>
      <input className = "submitButton" type="submit" value="Create New GAP"/>
  </form>
  </div>
  </div>
  )
}

export default NewCompany;