import React from "react";
import NavBar from './NavBar';  // Import the Navbar component
import '../css/NavBar.css'


function AboutUs() {

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const linksForPage1 = isAdmin ? [
    { name: 'Add New Company', path: '/new-company' , image:'/add-new-company.png'},
    { name: 'List of Companies', path: '/list-of-company', image: '/company-list.png'},
  ] : [
    { name: 'Add New Company', path: '/new-company' , image:'/add-new-company.png'},
  ]



  return (
    <div>
      <NavBar links={linksForPage1} /> {/* Passing the links to the Navbar component */}
      <div className="main-content">
      <h1>About us</h1>
      <p>This is the about us page</p>
      </div>
    </div>
  );
}

export default AboutUs;
