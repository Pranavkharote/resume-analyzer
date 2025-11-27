import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import ResumeUpload from "./components/ResumeUpload";
import "./index.css";
import LandingPage from "./pages/LandingPage";
import Authentication from "./pages/Authentication";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload/resume" element={<ResumeUpload />} />
          <Route path="/user/auth" element={<Authentication />} />
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar={false}
          closeOnClick
          draggable
          pauseOnHover
          theme="dark"
        />
      </AuthProvider>
    </Router>
  );
};

export default App;
