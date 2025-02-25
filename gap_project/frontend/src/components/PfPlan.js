import axios from 'axios';
import React from "react";

export async function pdfDownload(PDFTitle) {
    try {
        const postResponse = await axios.post('http://localhost:8000/gap/pdfplan/', {
            key1: 'BOOOOOOOOO',
            id: 1,
        });

        if (postResponse.status === 200) {
            console.log('POST request successful:', postResponse.data);

            const pdfResponse = await axios.get('http://localhost:8000/gap/pdfplan/', {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([pdfResponse.data]));
            const link = document.createElement('a');
            link.href = url;
            const title = PDFTitle +".pdf"
            link.setAttribute('download', title);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } else {
            console.error('POST request failed:', postResponse);
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

const PdfPlan = () => {
    return (
        <button onClick={pdfDownload}>Download .pdf file</button>
    );
};

export default PdfPlan;
