import React from "react";
import {useLocation, Link } from "react-router-dom";

const SpecificCompany = () => {
  //const { name } = useParams(); // Extract the company name from the URL this is not needed since we are using location
  const location = useLocation(); // Access state passed through Link
  const { num_of_analysis, date_registered, name } = location.state || {}; // Destructure state data

  return (
    <div>
      <h1>Hi, this is {name}!</h1>
      <p>Number of Analysis: {num_of_analysis}</p>
      <p>Date Created: {date_registered}</p>

        {/* Add a link to navigate back to the Company component.
        This goes back to "root" page : / */}
        <Link to="/">Back to Company List</Link>
    </div>
  );
};

export default SpecificCompany;
