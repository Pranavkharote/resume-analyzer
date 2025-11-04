import axios from "axios";
import httpStatus from "http-status";
import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({});

const client = axios.create({
  baseURL: "https://resume-analyzer-mmz4.onrender.com/users/auth",
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const router = useNavigate();

  // Return { success, message } so toast can work
  const handleRegister = async (name, email, password) => {
    try {
      const res = await client.post("/register", { name, email, password });
      if (res.status === httpStatus.CREATED) {
        return { success: true, message: res.data.message || "Registered successfully" };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Registration failed" };
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await client.post("/login", { email, password });
      if (res.status === httpStatus.OK) {
        localStorage.setItem("token", res.data.token);
        console.log("Login called with:", email);

        setUserData(res.data.user);
        return { success: true, message: res.data.message || "Login successful" };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };

  const data = { userData, setUserData, handleRegister, handleLogin };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
