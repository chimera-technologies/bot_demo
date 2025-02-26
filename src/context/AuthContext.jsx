import React, { createContext, useState, useContext, useMemo } from "react";
import PropTypes from "prop-types";
// Create AuthContext
const AuthContext = createContext();
import apiService from "../service/ApiService";

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (userData) => {
    try {
      const response = await apiService.post("/auth/login", userData);
      localStorage.setItem("authToken", response.token); 
      setUserData(userData);
    } catch (err) {
      console.error("Login failed:", err.message);
      setUserData(userData);
    }
  };

  const setUserData = (userData) => { 

    setIsAuthenticated(true);
    setUser(userData);

    //Todo - make it dynamic based on API response
    if (userData.username === "Admin") {  // Check if user is Admin
      userData.role = "Admin";
    } else {
      userData.role = "user";
    }

    const user = {
      username: userData.username,
      role: userData.role}

    sessionStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({ isAuthenticated, user, login, logout }),
        [isAuthenticated, user, login, logout]
      )}
    >
      {children}
    </AuthContext.Provider>
  );
};

// PropTypes validation for children
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
// useAuth Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
