import React from "react";
import {useLocation, Link } from "react-router-dom";

const SpecificCompany = () => {
  //const { name } = useParams(); // Extract the company name from the URL this is not needed since we are using location
  const location = useLocation(); // Access state passed through Link
  const { numOfAnalysis, dateRegistered, name } = location.state || {}; // Destructure state data

  return (
    <div>
      <h1>Hi, this is {name}!</h1>
      <p>Number of Analysis: {numOfAnalysis}</p>
      <p>Date Created: {dateRegistered}</p>

        {/* Add a link to navigate back to the Company component.
        This goes back to "root" page : / */}
        <Link to="/">Back to Company List</Link>
    </div>
  );
};

export default SpecificCompany;
