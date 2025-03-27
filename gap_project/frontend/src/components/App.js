import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import '../css/App.css';
import DetailScore from './DetailScore.js';
import GapAnalysis, { Elements } from './GapAnalysis.js';
import GapAnalysisConfirm, { GapInformation } from './GapAnalysisInformation.js';
import Home from './Home.js';
import { default as ListofCompany, default as ListOfCompany } from './ListofCompany.js';
import Login from './Login.js';
import NewCompany from './NewCompany.js';
import OverallOutput from './OverallOutput.js';
import PrivateRoute from './PrivateRoute.js';
import RegistedCompany from './RegistedCompany.js';
import Template from './Template.js';

function App() {
  return (
    <Router>
        <Template>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<PrivateRoute element={Home} />} />
            <Route path="/new-company" element={<PrivateRoute element={NewCompany} />} />
            <Route path="/list-of-company" element={<ListofCompany />} />
            <Route path='/registed-company' element={<RegistedCompany/>}/>
            <Route path='/overall-output' element={<OverallOutput/>}/>
            <Route path='/detail-score' element={<DetailScore/>}/>
            <Route path="/new-gap-confirm" element={<PrivateRoute element={GapAnalysisConfirm} />} />
            <Route path="/new-gap-information" element={<PrivateRoute element={GapInformation} />} />
            <Route path="/gap-analysis" element={<PrivateRoute element={GapAnalysis} />}/>
              <Route path="/gap-analysis/section1" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/section2" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/section3" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/section4" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/section5" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/section6" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/section7" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/section8" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/section9" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/section10" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/section11" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/section12" element={<PrivateRoute element={Elements} />} />
            <Route path="/list-of-companies" element={<PrivateRoute element={ListOfCompany} />}/>
          </Routes>
        </div>
      </Template>
    </Router>
  );
}

export default App;
