import '../css/App.css';
import Login from './Login'; 
import Home from './Home';
import NewCompany from './NewCompany';
import GapAnalysis from './GapAnalysis';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GapAnalysisConfirm, {GapInformation} from './GapAnalysisInformation';

function App() {
  return (
    <Router>
      <div className="video-container">
        <video autoPlay muted loop className="background-video" src='/background-video.mp4' type="video/mp4" />
      </div>
      <div className="overlay"></div>

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
      </Router>
  );
}

export default App;
