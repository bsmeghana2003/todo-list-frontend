import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from '../src/LoginPage';
import Signup from '../src/Signup';
import Dashboard from '../src/Dashboard';

const App = () => {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
};

export default App;