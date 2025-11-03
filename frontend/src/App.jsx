import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import ResumeUpload from "./components/ResumeUpload";
import "./index.css";
import LandingPage from "./pages/LandingPage";
import Authentication from "./pages/Authentication";
import { AuthProvider } from "./context/AuthContext";
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload/resume" element={<ResumeUpload />} />
          <Route path="/user/auth" element={<Authentication />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
