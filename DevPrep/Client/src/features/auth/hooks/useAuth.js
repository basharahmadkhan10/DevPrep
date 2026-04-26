import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const API_URL = "https://devprep-backend-hpnv.onrender.com/api/v1";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiRef = useRef(null);

  if (!apiRef.current) {
    const instance = axios.create({
      baseURL: API_URL,
      withCredentials: true,
    });

    instance.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    // 🔥 refresh logic
    instance.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const res = await axios.get(
              `${API_URL}/auth/refresh-token`,
              { withCredentials: true }
            );

            const newToken = res.data.accessToken;

            setAccessToken(newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            return instance(originalRequest);
          } catch (err) {
            setUser(null);
            setAccessToken(null);
            window.location.href = "/login";
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );

    apiRef.current = instance;
  }

  const api = apiRef.current;

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get("/auth/refresh-token");

        if (res.data?.accessToken) {
          setAccessToken(res.data.accessToken);
        }
      } catch (err) {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [api]);

  // LOGIN
  const handleLogin = useCallback(
    async (username, password) => {
      try {
        setError(null);

        const res = await api.post("/auth/login", {
          username,
          password,
        });

        const data = res.data?.data;

        if (data?.accessToken) {
          setUser(data);
          setAccessToken(data.accessToken); 
          return data;
        }

        return null;
      } catch (err) {
        setError(err.response?.data?.message || "Login failed");
        return null;
      }
    },
    [api]
  );

  const handleLogout = useCallback(async () => {
    try {
      await api.get("/auth/logout");
    } catch {}

    setUser(null);
    setAccessToken(null);
    window.location.href = "/login";
  }, [api]);

  return {
    user,
    accessToken,
    loading,
    error,
    handleLogin,
    handleLogout,
    api,
  };
};
