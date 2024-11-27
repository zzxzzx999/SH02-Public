import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import '../css/App.css';
import Home from './Home';
import Login from './Login';
import Template from './Template';

function App() {
  return (
    <Router>
      <Template>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Template>
    </Router>
  );
}

export default App;
