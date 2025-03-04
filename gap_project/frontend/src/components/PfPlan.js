import axios from 'axios';
import React from "react";

export async function pdfDownload(gapID, PDFTitle) {
    try {
        const postResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/pdfplan/`, {
            key1: 'BOOOOOOOOO',
            id: gapID,
        });

        if (postResponse.status === 200) {
            console.log('POST request successful:', postResponse.data);

            const pdfResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/pdfplan/`, {
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
