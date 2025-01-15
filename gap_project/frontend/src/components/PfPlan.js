import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

class PdfPlan extends React.Component {

    state = {
        filename : [],
    }
        
    onButtonClick() {
        let data ;

        axios.get('http://localhost:8000/gap/pdfplan/')
        .then(res => {
            data = res.data;
            this.setState({
                filename : data   
            });
        })
        .catch(err => {})


        const pdfTitle = this.filename;
        console.log(pdfTitle)
        const pdfUrl = "../../gap/improvementPlan.pdf";
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = pdfTitle; // specify the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    render() {    
        return (
            <>
                <center>
                    <h3>
                        Click on below button to download improvement plan
                        file
                    </h3>
                    <button onClick={this.onButtonClick}>
                        Download PDF
                    </button>
                </center>
            </>
        );
    }
};

export default PdfPlan;
