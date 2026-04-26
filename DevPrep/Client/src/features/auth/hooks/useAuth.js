import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL =
  "https://devprep-backend-hpnv.onrender.com/api/v1";

export const useAuth = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });

 

  api.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const refreshResponse = await axios.get(
            `${API_URL}/auth/refresh-token`,
            {
              withCredentials: true,
            }
          );

          const newAccessToken =
            refreshResponse.data.accessToken;

          localStorage.setItem(
            "accessToken",
            newAccessToken
          );

          originalRequest.headers.Authorization =
            `Bearer ${newAccessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          console.log(
            "Refresh token failed:",
            refreshError.response?.data ||
              refreshError.message
          );

          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");

          setUser(null);

          window.location.href = "/login";

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

 

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser =
        localStorage.getItem("user");
      const storedToken =
        localStorage.getItem("accessToken");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));

        try {
          const response = await axios.get(
            `${API_URL}/auth/refresh-token`,
            {
              withCredentials: true,
            }
          );

          if (response.data.accessToken) {
            localStorage.setItem(
              "accessToken",
              response.data.accessToken
            );
          }
        } catch (err) {
          console.log(
            "Token refresh failed:",
            err.response?.data || err.message
          );
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  /*
  ========================================
  LOGIN
  ========================================
  */

  const handleLogin = useCallback(
    async (username, password) => {
      try {
        setError(null);

        const response = await api.post(
          "/auth/login",
          {
            username,
            password,
          }
        );

        if (response.data.data.accessToken) {
          localStorage.setItem(
            "accessToken",
            response.data.data.accessToken
          );

          localStorage.setItem(
            "user",
            JSON.stringify(response.data.data)
          );

          setUser(response.data.data);

          return response.data.data;
        }

        return null;
      } catch (err) {
        console.log("Login error:", err);

        setError(
          err.response?.data?.message ||
            "Login failed"
        );

        return null;
      }
    },
    []
  );

 

  const handleLogout = useCallback(
    async () => {
      try {
        await api.get("/auth/logout");
      } catch (err) {
        console.log("Logout error:", err);
      } finally {
        localStorage.removeItem(
          "accessToken"
        );
        localStorage.removeItem("user");

        setUser(null);
      }
    },
    []
  );

  return {
    user,
    loading,
    error,
    handleLogin,
    handleLogout,
    api,
  };
};
