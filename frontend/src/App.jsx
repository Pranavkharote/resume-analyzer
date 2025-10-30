import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import ResumeUpload from "./components/ResumeUpload";
import "./index.css";
import LandingPage from "./pages/LandingPage";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload/resume" element={<ResumeUpload />} />
      </Routes>
    </Router>
  );
};

export default App;
