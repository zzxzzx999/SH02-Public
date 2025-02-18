import axios from 'axios';
import React, { useEffect, useState } from "react";

const App = () => {
    async function postAndDownload() {
    try {
        // Step 1: Post data to the endpoint
        const postResponse = await axios.post('http://localhost:8000/gap/pdfplan/', {
        key1: 'BOOOOOOOOO',
        id: 1,
        });

        // Step 2: Check response from the POST request
        if (postResponse.status === 200) {
        console.log('POST request successful:', postResponse.data);

        // Step 3: Download the PDF
        const pdfResponse = await axios.get('http://localhost:8000/gap/pdfplan/', {
            responseType: 'blob', // Ensure the response is treated as a binary blob
        });

        // Step 4: Create a link to download the PDF
        const url = window.URL.createObjectURL(new Blob([pdfResponse.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.pdf'); // Change the file name as needed
        document.body.appendChild(link);
        link.click();

        // Clean up the DOM
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        } else {
        console.error('POST request failed:', postResponse);
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }
    }

    return(
        <button onClick={postAndDownload}> Download .pdf file</button>
    );

}

export default App;

