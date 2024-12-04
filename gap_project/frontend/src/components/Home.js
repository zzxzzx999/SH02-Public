import React from "react";
import NavBar from './NavBar';  // Import the Navbar component
import '../css/NavBar.css';
import '../css/Home.css';


function AboutUs() {
  const linksForPage1 = [
    { name: 'Add New Company', path: '/new-company' , image:'/add-new-company.png'},
  ];

  return (
    <div className="main-content">
      <NavBar links={linksForPage1} /> {/* Passing the links to the Navbar component */}
      <div className="about-us-info">
        <div className="about-us-search">
          <h2>Search for Company</h2>
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
    </div>
  );
}

export default AboutUs;