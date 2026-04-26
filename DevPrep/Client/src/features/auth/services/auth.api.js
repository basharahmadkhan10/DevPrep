import axios from "axios";

const api = axios.create({
  baseURL: "https://devprep-backend-hpnv.onrender.com",
  withCredentials: true, // VERY IMPORTANT
});

export async function register({ name, email, password }) {
  try {
    const response = await api.post(
      "/api/v1/auth/register",
      { name, email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data?.data?.accessToken) {
      localStorage.setItem(
        "accessToken",
        response.data.data.accessToken
      );
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.data)
      );
    }

    return response.data;
  } catch (error) {
    console.log(error.response?.data || error.message);
    throw error;
  }
}

export async function login({ username, password }) {
  try {
    const response = await api.post(
      "/api/v1/auth/login",
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data?.data?.accessToken) {
      localStorage.setItem(
        "accessToken",
        response.data.data.accessToken
      );
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.data)
      );
    }

    return response.data;
  } catch (error) {
    console.log(error.response?.data || error.message);
    throw error;
  }
}

export async function logout() {
  try {
    const response = await api.get(
      "/api/v1/auth/logout"
    );

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    return response.data;
  } catch (error) {
    console.log(error.response?.data || error.message);
    throw error;
  }
}

export async function tokenGeneration() {
  try {
    const response = await api.get(
      "/api/v1/auth/refresh-token"
    );

    if (response.data?.accessToken) {
      localStorage.setItem(
        "accessToken",
        response.data.accessToken
      );
    }

    return response.data;
  } catch (error) {
    console.log(
      "Token refresh failed:",
      error.response?.data || error.message
    );

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    throw error;
  }
}

export default api;
