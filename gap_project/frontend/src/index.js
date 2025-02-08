import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App.js';

// think of the REACT pages as a tree, the root of this tree is defined here.
// All of the components are called by eachother, and it starts with one component called : <App />
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
