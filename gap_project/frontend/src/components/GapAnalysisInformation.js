import React, {useState, useEffect} from 'react';
import NavBar from './NavBar';  // Import the Navbar component
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function GapAnalysisConfirm() {
  const links = [];
  const location = useLocation();
  const [companyName, setCompanyName] = useState('');

  console.log("company name: " + companyName);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const company = queryParams.get('company');
    setCompanyName(company);
  }, [location]);

  return (
    <div className="gap-confirm">
    <NavBar links={links} logout={true}/>
    <div className = "bubble-container" style={{width:'500px', height:'400px'}}>
      <h2>{companyName}</h2>
        <p>Do you want to start a new GAP analysis?</p>
        <p>Once you start, you can leave and come back to continue where you left off.</p>

        <Link to={`/new-gap-information?company=${companyName}`} className="submitButton">YES, START GAP ANALYSIS</Link>
        <Link to = '/home' className="submitButton" style={{marginTop:'20px'}}>NO, COME BACK LATER</Link>
    </div>
    </div>
    );
}

export default GapAnalysisConfirm;

function GapInformation(){
  const links = [];

  const location = useLocation();
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const company = queryParams.get('company');
    setCompanyName(company);
  }, [location]);

  const [consultant, setConsultant] = useState("");
  const [companyRep, setCompanyRep] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [url, setUrl] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      //change url here when making API
      await axios.post("http://127.0.0.1:8000/api/create-gap/",{
        company_name: companyName,
        consultant: consultant,
        company_rep: companyRep,
        company_email: companyEmail,
        additional_notes: additionalNotes,
        url: url,
      });
      navigate(`/gap-analysis?company=${companyName}`);
    } catch (error) {
      console.error("Error submitting gap information:", error.response?.data || error.message);
    }
  };


  return (
  <div className="gap-info">
  <NavBar links={links} logout={true}/>
  <div className = "bubble-container" style={{padding:'15px'}}>
  <h2>{companyName}</h2>
  <form onSubmit={handleSubmit} className="form">
      <label>
      <input 
          type="text" 
          value={consultant}
          onChange={(e) => setConsultant(e.target.value)}
          placeholder = "Consultant"
          required
          style ={{
            marginTop:'15px',
            width:'350px'
          }}
      />
      </label>

      <label>
      <input 
          type="text" 
          value={companyRep}
          onChange={(e) => setCompanyRep(e.target.value)}
          placeholder = "Company Representative Name"
          required
          style ={{
            width:'350px',
            marginTop:'5px',
          }}
      />
      </label>

      <label>
      <input 
          type="text" 
          value={companyEmail}
          onChange={(e) => setCompanyEmail(e.target.value)}
          placeholder = "Company Representative Email"
          required
          style ={{
            width:'350px',
            marginTop:'5px',
          }}
      />
      </label>

      <label>
      <input 
          type="text" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder = "Gap Analysis Evidence URL"
          required
          style ={{
            width:'350px',
            marginTop:'5px',
          }}
      />
      </label>

      <label> 
      <textarea
          type="text" 
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder = "Additional Notes"
          style ={{
            width:'350px',
            marginTop:'10px',
          }}
      />
      </label>
      <input className = "submitButton" type="submit" value="Create New GAP" style={{marginTop:'15px'}}/>
  </form>
  </div>
  </div>
  )
}

export {GapInformation};
