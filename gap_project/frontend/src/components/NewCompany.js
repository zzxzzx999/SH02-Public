import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../css/Login.css';
import NavBar from './NavBar.js'; // Import the Navbar component

function NewCompany() {
    const userRole = localStorage.getItem("userRole"); // Get the stored role
    const linksForPage2 = [
        { 
        name: 'Previous Page', 
        path: userRole === "admin" ? "/list-of-company" : "/home", // Conditional path
        image: "/back-button.png" 
        }
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
        if(userRole === "admin"){
            navigate("/list-of-companies");
        }else{
            navigate(`/new-gap-confirm?company=${encodeURIComponent(companyName)}`);
        }
    } catch (error) {
        console.error("Error : ", error.response || error.message);
    }
  };
  
    return (
        <div className="create-new-company">
            <NavBar links = {linksForPage2} logout={true}/>
            <div className="bubble-container" style = {{width:'500px', padding:'30px'}}>
            <h2 style={{fontSize:'24px'}}> CREATE NEW COMPANY </h2>
                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="company-name"></label>
                        <input
                            type="text"
                            id="company-name"
                            value={companyName} // Controlled input
                            onChange={(e) => setCompanyName(e.target.value)} // Update state
                            placeholder = "Company Name"
                            required
                        />
                    <label> 
                        <textarea
                            id="add_comments"
                            style={{width:'350px'}}
                            type="text" 
                            value={additionalNotes}
                            onChange={(e) => setAdditionalNotes(e.target.value)}
                            placeholder = "Additional Notes"
                        />
                    </label>
                <input className = "submitButton" type="submit" value= {userRole === "admin" ? "Create New Company" : "Create New GAP"}/>
            </form>
            </div>
        </div>
    )
}

export default NewCompany;