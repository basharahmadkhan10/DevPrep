// auth.context.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import apiService from "./services/auth.api.js";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    try {
      const savedToken = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser) {
        console.log("Using saved token from localStorage");
        setAccessToken(savedToken);
        setUser(JSON.parse(savedUser));
        setLoading(false);
        clearTimeout(timeout);
        return;
      }
      
      // Then try API
      const userData = await apiService.getCurrentUser();
      if (userData) {
        setUser(userData);
        if (userData.accessToken) {
          setAccessToken(userData.accessToken);
          localStorage.setItem('accessToken', userData.accessToken);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (err) {
      console.error("Auth initialization failed:", err);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setError(null);
      const userData = await apiService.login({ username, password });
      setUser(userData);
      if (userData?.accessToken) {
        setAccessToken(userData.accessToken);
        
        localStorage.setItem('accessToken', userData.accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      return { success: true, data: userData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const googleLogin = async (credential) => {
    try {
      setError(null);
      const userData = await apiService.googleLogin(credential);
      setUser(userData);
      if (userData?.accessToken) {
        setAccessToken(userData.accessToken);
        
        localStorage.setItem('accessToken', userData.accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      return { success: true, data: userData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Google login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await apiService.register({ name, email, password });
      
      if (response.data?.accessToken) {
        const userData = response.data;
        setUser(userData);
        setAccessToken(userData.accessToken);

        localStorage.setItem('accessToken', userData.accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, data: userData };
      }
      
      return { success: false, error: "Registration failed" };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    await apiService.logout();
    setUser(null);
    setAccessToken(null);
    setError(null);
   
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    accessToken,
    error,
    login,
    googleLogin, 
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
