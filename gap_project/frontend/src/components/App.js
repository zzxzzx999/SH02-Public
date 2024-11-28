import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import '../css/App.css';
import Home from './Home';
import NewCompany from './NewCompany';
import GapAnalysis from './GapAnalysis';
import Login from './Login';
import Template from './Template';
import GapAnalysisConfirm, {GapInformation} from './GapAnalysisInformation';

function App() {
  return (
    <Router>
        <Template>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/new-company" element={<NewCompany />} />
            <Route path="/new-gap-confirm" element={<GapAnalysisConfirm />} />
            <Route path="/new-gap-information" element={<GapInformation />} />
            <Route path="/gap-analysis" element={<GapAnalysis />} />
          </Routes>
        </div>
      </Template>
    </Router>
  );
}

export default App;
