import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from './NavBar';  // Import the Navbar component
import '../css/Login.css'
import axios from 'axios';

function NewCompany() {
  const linksForPage2 = [
    { name: 'Previous Page', path: '/home', image:'/back-button.png'},
  ];

  const [companyName, setCompanyName] = useState("");
  const [additionalNotes, setAdditionalNotes] =useState("");
  const navigate = useNavigate();
  const handleSubmit = async (event) => { 
      event.preventDefault();
      const token = localStorage.getItem("authToken");

      const payload = {
          name: companyName,
          notes: additionalNotes || "",
      };

      try { 
          await axios.post("http://localhost:8000/api/companies/", payload, {
              headers: { 
                  Authorization: `Token ${token}`,
              },
          });
          setCompanyName("");
          setAdditionalNotes("");
          navigate("/new-gap-confirm");
      } catch (error) {
          console.error("Error : ", error.response || error.message);
      }
  };
  return (
    <div className="create-new-company">
        <NavBar links = {linksForPage2} logout={true}/>
        <div className="bubble-container" style = {{width:'500px'}}>
        <h2> CREATE NEW COMPANY </h2>
            <form className="form" onSubmit={handleSubmit}>
                {/* company name */}

                <label htmlFor="company-name"></label>
                    <input
                        type="text"
                        id="company-name"
                        value={companyName} // Controlled input
                        onChange={(e) => setCompanyName(e.target.value)} // Update state
                        placeholder = "Company Name"
                    />


                {/* Additional comments */}
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