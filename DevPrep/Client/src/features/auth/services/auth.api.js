/** @format */

import axios from "axios";

const api = axios.create({
  baseURL: "https://devprep-backend-hpnv.onrender.com",
  withCredentials: true,
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
      },
    );

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
      },
    );

    return response.data;
  } catch (error) {
    console.log(error.response?.data || error.message);
    throw error;
  }
}

export async function logout() {
  try {
    const response = await api.get("/api/v1/auth/logout");

    return response.data;
  } catch (error) {
    console.log(error.response?.data || error.message);
    throw error;
  }
}

export async function tokenGeneration() {
  try {
    const response = await api.get("/api/v1/auth/refresh-token");

    return response.data;
  } catch (error) {
    console.log(error.response?.data || error.message);
    throw error;
  }
}
