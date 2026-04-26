import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const API_URL = "https://devprep-backend-hpnv.onrender.com/api/v1";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiRef = useRef(null);


  if (!apiRef.current) {
    const instance = axios.create({
      baseURL: API_URL,
      withCredentials: true,
    });

    instance.interceptors.response.use(
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
              { withCredentials: true }
            );

            const newAccessToken =
              refreshResponse.data.accessToken;

            originalRequest.headers.Authorization =
              `Bearer ${newAccessToken}`;

            return instance(originalRequest);
          } catch (refreshError) {
            setUser(null);
            setLoading(false);
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    apiRef.current = instance;
  }

  const api = apiRef.current;

 
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/refresh-token");

        if (res.data?.accessToken) {
          setUser({ token: res.data.accessToken });
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [api]);

  /*
  ========================================
  LOGIN
  ========================================
  */
  const handleLogin = useCallback(
    async (username, password) => {
      try {
        setError(null);

        const response = await api.post("/auth/login", {
          username,
          password,
        });

        const userData = response.data?.data;

        if (userData?.accessToken) {
          setUser(userData); // memory only

          return userData;
        }

        return null;
      } catch (err) {
        setError(
          err.response?.data?.message || "Login failed"
        );

        return null;
      }
    },
    [api]
  );


  const handleLogout = useCallback(async () => {
    try {
      await api.get("/auth/logout");
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  }, [api]);

  return {
    user,
    loading,
    error,
    handleLogin,
    handleLogout,
    api,
  };
};
