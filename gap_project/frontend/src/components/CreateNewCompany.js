import React, { useState } from "react";
import '../css/CreateNewCompany.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";


function CreateNewCompany(){
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
            navigate("/list-of-company");
        } catch (error) {
            console.error("Error : ", error.response || error.message);
        }
    };
    return (
        
            <div className="bubble-container-new-company">
                <h1 className="title"> Create a New Company</h1>

                <form className="form-container" onSubmit={handleSubmit}>
                    {/* company name */}
                    <div className="form-group">
                        <label htmlFor="company-name">Company Name:</label>
                        <input
                            type="text"
                            id="company-name"
                            value={companyName} // Controlled input
                            onChange={(e) => setCompanyName(e.target.value)} // Update state
                        />
                    </div>

                    {/* Additional comments */}
                    <div className="form-group">
                        <label htmlFor="add-comments">Additional Comments:</label>
                        <textarea id="add_cmments" name="add-comments" ></textarea>
                    </div>

                    {/* button */}
                    <button className="submit-button">Create New Company</button>
                </form>
            </div>
            
    );
}

export default CreateNewCompany;