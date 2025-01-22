// Filename - App.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import improvementPlan from './improvementPlan.pdf';

const App = () => {

    const[pdfTitle, setPdfTitle] = useState("");
    const[pdf, getPdf] = useState([]);

    // Function will execute on click of button
    const onButtonClick = () => {

        //axios.get("http://localhost:8000/gap/pdfplan/",
        //    {}).then(response => console.log(response))//(response) => {setPdfTitle(response.data);})
        //    .catch((error) => {console.error("Error :", error.response || error.message);

        //});

        axios.post("http://localhost:8000/gap/pdfplan/",{id : 1}).then(response => setPdfTitle(response.data))//(response) => {setPdfTitle(response.data);})
            .catch((error) => {console.error("Error :", error.response || error.message);
            });
        
            
        
    };
    return (
        <>
            <center>
                <h1>GAP pdf download</h1>
                <h3>
                    Click on below button to download PDF
                    file
                </h3>
                    <a

                        href={require('./improvementPlan.pdf')}
                        download="Example-PDF-document"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <button onClick={onButtonClick}> Download .pdf file</button>
                    </a>
            </center>
        </>
    );
};

export default App;
