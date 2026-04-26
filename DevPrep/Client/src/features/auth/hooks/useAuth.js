import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000/api/v1';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Axios instance with interceptors for token refresh
  const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for cookies
  });

  // Response interceptor for token refresh
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const response = await axios.get(`${API_URL}/auth/refresh-token`, {
            withCredentials: true,
          });
          const newAccessToken = response.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          setUser(null);
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const accessToken = localStorage.getItem('accessToken');
      
      if (storedUser && accessToken) {
        setUser(JSON.parse(storedUser));
        // Try to refresh token if needed
        try {
          const response = await axios.get(`${API_URL}/auth/refresh-token`, {
            withCredentials: true,
          });
          if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
          }
        } catch (err) {
          // Refresh failed, but we still have user data
          console.log('Token refresh failed:', err);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = useCallback(async (username, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      if (response.data.data.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        setUser(response.data.data);
        return response.data.data;
      }
      return null;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
      return null;
    }
  }, [api]);

  const handleSignup = useCallback(async (name, email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });

      if (response.data.data.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        setUser(response.data.data);
        return response.data.data;
      }
      return null;
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Signup failed');
      return null;
    }
  }, [api]);

  const handleLogout = useCallback(async () => {
    try {
      await api.get('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, [api]);

  const handleGoogleLogin = useCallback(async (credential) => {
    try {
      setError(null);
      const response = await api.post('/auth/google', {
        credential,
      });

      if (response.data.data.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        setUser(response.data.data);
        return response.data.data;
      }
      return null;
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.response?.data?.message || 'Google login failed');
      return null;
    }
  }, [api]);

  const updateProfile = useCallback(async (profileData) => {
    try {
      setError(null);
      const accessToken = localStorage.getItem('accessToken');
      const response = await api.put('/user/profile', profileData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (response.data.user) {
        const updatedUser = { ...user, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return updatedUser;
      }
      return null;
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Profile update failed');
      return null;
    }
  }, [api, user]);

  const getAccessToken = useCallback(() => {
    return localStorage.getItem('accessToken');
  }, []);

  return {
    user,
    loading,
    error,
    handleLogin,
    handleSignup,
    handleLogout,
    handleGoogleLogin,
    updateProfile,
    getAccessToken,
    api, // Export api for other hooks to use
  };
};