import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import '../css/App.css';
import Home from './Home';
import NewCompany from './NewCompany';
import Login from './Login';
import Template from './Template';

function App() {
  return (
    <Router>
        <Template>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/new-company" element={<NewCompany />} />
          </Routes>
        </div>
      </Template>
    </Router>
  );
}

export default App;
