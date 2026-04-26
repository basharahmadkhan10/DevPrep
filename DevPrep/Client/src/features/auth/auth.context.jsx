import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_URL =
  "https://devprep-backend-hpnv.onrender.com/api/v1/auth";

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(true);

  const refreshAccessToken = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/refresh-token`,
        {
          withCredentials: true, // cookie bhejne ke liye
        }
      );

      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        localStorage.setItem(
          "accessToken",
          response.data.accessToken
        );
      }

      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }
    } catch (error) {
      console.log(
        "Refresh token failed:",
        error.response?.data || error.message
      );

      setAccessToken(null);
      setUser(null);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAccessToken(); 
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
