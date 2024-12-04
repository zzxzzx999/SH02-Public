import React from "react";
import '../css/CreateNewCompany.css';


function CreateNewCompany(){
    return (
        
            <div className="bubble-container-new-company">
                <h1 className="title"> Create a New Company</h1>

                <form className="form-container">
                    {/* company name */}
                    <div className="form-group">
                        <label htmlFor="company-name">Company Name:</label>
                        <input type="text" id="company-name" name="company-name" />
                    
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