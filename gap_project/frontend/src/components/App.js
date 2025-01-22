import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import '../css/App.css';
import DetailScore from './DetailScore';
import GapAnalysis, { Elements } from './GapAnalysis';
import GapAnalysisConfirm, { GapInformation } from './GapAnalysisInformation';
import Home from './Home';
import { default as ListofCompany, default as ListOfCompany } from './ListofCompany';
import Login from './Login';
import NewCompany from './NewCompany';
import OverallOutput from './OverallOutput';
import PrivateRoute from './PrivateRoute';
import RegistedCompany from './RegistedCompany';
import Results from './Results';
import Template from './Template';
import PdfPlan from './PfPlan';

function App() {
  return (
    <Router>
        <Template>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<PdfPlan />} />
            <Route path="/home" element={<PrivateRoute element={Home} />} />
            <Route path="/new-company" element={<PrivateRoute element={NewCompany} />} />
            <Route path="/list-of-company" element={<ListofCompany />} />
            <Route path='/registed-company' element={<RegistedCompany/>}/>
            <Route path='/overall-output' element={<OverallOutput/>}/>
            <Route path='/detail-score' element={<DetailScore/>}/>
            <Route path="/new-gap-confirm" element={<PrivateRoute element={GapAnalysisConfirm} />} />
            <Route path="/new-gap-information" element={<PrivateRoute element={GapInformation} />} />
            <Route path="/gap-analysis" element={<PrivateRoute element={GapAnalysis} />}/>
              <Route path="/gap-analysis/policy" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/management" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/documented-system" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/meetings" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/performance-measurement" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/committee-and-representatives" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/investigation-process" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/incident-reporting" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/training-plan" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/risk-management-process" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/audit-and-inspection-process" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/improvement-planning" element={<PrivateRoute element={Elements} />} />
            <Route path="/results" element={<PrivateRoute element={Results} />}/>

            <Route path="/list-of-companies" element={<PrivateRoute element={ListOfCompany} />}/>
          </Routes>
        </div>
      </Template>
    </Router>
  );
}

export default App;
