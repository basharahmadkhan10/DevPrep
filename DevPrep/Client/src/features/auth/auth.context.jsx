import React, { createContext, useEffect, useState } from "react";
import { refreshToken } from "./useAuthApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    try {
      const data = await refreshToken();

      setAccessToken(data.accessToken);
      setUser(data.user);
    } catch {
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        loading,
        setAccessToken,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
