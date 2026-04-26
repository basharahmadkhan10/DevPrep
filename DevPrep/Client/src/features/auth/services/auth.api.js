import axios from "axios";

const api = axios.create({
  baseURL: "https://devprep-backend-hpnv.onrender.com",
  withCredentials: true,
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// attach token automatically
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export async function register({ name, email, password }) {
  const response = await api.post("/api/v1/auth/register", {
    name,
    email,
    password,
  });

  if (response.data?.data?.accessToken) {
    setAccessToken(response.data.data.accessToken);
  }

  return response.data;
}

export async function login({ username, password }) {
  const response = await api.post("/api/v1/auth/login", {
    username,
    password,
  });

  if (response.data?.data?.accessToken) {
    setAccessToken(response.data.data.accessToken);
  }

  return response.data;
}

export async function logout() {
  const response = await api.get("/api/v1/auth/logout");

  setAccessToken(null);

  return response.data;
}

export async function tokenGeneration() {
  const response = await api.get("/api/v1/auth/refresh-token");

  if (response.data?.accessToken) {
    setAccessToken(response.data.accessToken);
  }

  return response.data;
}

export default api;
