import axios from "axios";

const API_URL = "https://devprep-backend-hpnv.onrender.com/api/v1";

class ApiService {
  constructor() {
    this.accessToken = null;
    this.refreshPromise = null;
    
    this.api = axios.create({
      baseURL: API_URL,
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            this.clearAuth();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async refreshToken() {
    
    if (!this.refreshPromise) {
      this.refreshPromise = this.api
        .get("/auth/refresh-token")
        .then((response) => {
          const newToken = response.data.accessToken;
          if (newToken) {
            this.accessToken = newToken;
          }
          return newToken;
        })
        .catch((error) => {
          this.accessToken = null;
          throw error;
        })
        .finally(() => {
          this.refreshPromise = null;
        });
    }

    return this.refreshPromise;
  }

  setAuthToken(token) {
    this.accessToken = token;
  }

  clearAuth() {
    this.accessToken = null;
  }

  async register({ name, email, password }) {
    const response = await this.api.post("/auth/register", {
      name,
      email,
      password,
    });

    if (response.data?.data?.accessToken) {
      this.accessToken = response.data.data.accessToken;
    }

    return response.data;
  }

  async login({ username, password }) {
    const response = await this.api.post("/auth/login", {
      username,
      password,
    });

    if (response.data?.data?.accessToken) {
      this.accessToken = response.data.data.accessToken;
      return response.data.data;
    }

    throw new Error("Login failed");
  }

  async logout() {
    try {
      await this.api.post("/auth/logout");
    } finally {
      this.clearAuth();
    }
  }

  async getCurrentUser() {
    try {
      const token = await this.refreshToken();
      if (token) {
    
        return { accessToken: token };
      }
      return null;
    } catch {
      return null;
    }
  }
}

export default new ApiService();
