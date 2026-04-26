/** @format */

import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAccessToken = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/v1/auth/refresh-token",
        {
          withCredentials: true, // cookie bhejne ke liye
        }
      );
      setAccessToken(response.data.accessToken);
      setUser(response.data.user || null);
    } catch (error) {
      console.log(
        "Refresh token failed:",
        error.response?.data || error.message
      );

      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAccessToken(); // page reload pe chalega
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        setUser,
        loading,
        setLoading,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
