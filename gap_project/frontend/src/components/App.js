import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import '../css/App.css';
import Home from './Home';
import NewCompany from './NewCompany';
import GapAnalysis, {Elements} from './GapAnalysis';
import ListofCompany from './ListofCompany';
import Login from './Login';
import Template from './Template';
import GapAnalysisConfirm, {GapInformation} from './GapAnalysisInformation';
import PrivateRoute from './PrivateRoute';

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
            <Route path="/new-gap-confirm" element={<PrivateRoute element={GapAnalysisConfirm} />} />
            <Route path="/new-gap-information" element={<PrivateRoute element={GapInformation} />} />
            <Route path="/gap-analysis" element={<PrivateRoute element={GapAnalysis} />}/>
              <Route path="/gap-analysis/policy" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/management" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/meetings" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/performance-measurement" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/committee-and-representatives" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/investigation-process" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/incident-reporting" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/training-plan" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/risk-management-process" element={<PrivateRoute element={Elements} />} />
              <Route path="/gap-analysis/improvement-planning" element={<PrivateRoute element={Elements} />} />
          </Routes>
        </div>
      </Template>
    </Router>
  );
}

export default App;
