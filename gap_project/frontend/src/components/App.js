import '../css/App.css';
import Login from './Login'; 
import Home from './Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
          </Routes>
        </div>
      </Router>
  );
}

export default App;
