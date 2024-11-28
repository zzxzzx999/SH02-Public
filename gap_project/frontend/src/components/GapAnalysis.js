import React from "react";
import NavBar from './NavBar';  // Import the Navbar component
import '../css/NavBar.css'


function GapAnalysis() {
  const links = [];

  return (
    <div>
      <div className="gap">
      <NavBar links={links} /> {/* Passing the links to the Navbar component */}
      <div className="main-content">
      <h1>GAP ANALYSIS</h1>
      <p>This is where the GAP analysis page would be...</p>
      </div>
      </div>
    </div>
  );
}

export default GapAnalysis;