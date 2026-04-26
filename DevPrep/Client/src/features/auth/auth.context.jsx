import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: "https://devprep-backend-hpnv.onrender.com/api/v1",
    withCredentials: true,
  });

  const refreshAccessToken = async () => {
    try {
      const res = await api.get("/auth/refresh-token");

      setAccessToken(res.data.accessToken);
      setUser(res.data.user); 
    } catch (err) {
      setAccessToken(null);
      setUser(null);
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
        user,
        loading,
        setAccessToken,
        setUser,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
