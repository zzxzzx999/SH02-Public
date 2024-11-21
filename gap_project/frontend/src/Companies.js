import React, { useEffect, useState } from "react";
import axios from "axios";

function Company() {
  // companies is an array - it stores all the companies in the database
  // also uses the method setCompanies to update the companies variable
  const [companies, setCompanies] = useState([]);

  //useEffect is a React hook that allows you to perform side effects (fetching data from API (rest)) in function components.
  //hooks allow function components to use state, perform side effects, and more
  //hook examples :  const [companies, setCompanies] = useState([]); and useEffect()

  // axios sends a get request to "http://localhost:8000/gap/companies/"
  // this uses port 8000 which is used by the database
  // In the urls.py you can see that the gap/companies path links to the index view
  // the index view returns the data to axios.
  // once it gets a response (.then()) it then sets the companies array to the response given from the index view (the companies info)
  // .catch should be used for debugging
  // this is the workflow of how to connect to database from react / how to connect to react from database
  useEffect(() => {
    axios
      .get("http://localhost:8000/gap/companies/")
      .then((response) => {
        setCompanies(response.data); // Set the data received from the API
      })
      .catch((error) => {
        console.error("Error fetching companies:", error); // Log any errors
      });
  }, []);  // Empty array means "run this effect only once after the initial render"

  return (
    // loop through the companies array and display relevant info
    <div>
      {companies.map((company) => (
        <div key={company.name}>
          <h1>{company.name}</h1>
          <p>Number of analysis = {company.numOfAnalysis}</p>
          <p>Date created = {company.dateRegistered}</p>
        </div>
      ))}
    </div>
  );
}

export default Company;
