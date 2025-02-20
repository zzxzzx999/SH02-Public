import React from "react";
import '../css/CreateNewCompany.css';
import '../css/NavBar.css';
import NavBar from "./NavBar";


function CreateNewCompany(){
    const linksForPage3 = [];
    return (

        <div>
        <NavBar links={linksForPage3} />
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
                        <textarea id="add_comments" name="add-comments" ></textarea>
                    </div>

                    {/* button */}
                    <button className="submit-button">Create New Company</button>
                </form>
            </div>
            </div>
            
    );
}

export default CreateNewCompany;
