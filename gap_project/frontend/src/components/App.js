import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import '../css/App.css';
import Home from './Home';
import NewCompany from './NewCompany';
import GapAnalysis from './GapAnalysis';
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
            <Route path="/gap-analysis" element={<PrivateRoute element={GapAnalysis} />} />
          </Routes>
        </div>
      </Template>
    </Router>
  );
}

export default App;
