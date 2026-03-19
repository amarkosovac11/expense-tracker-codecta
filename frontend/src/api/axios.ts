import axios from "axios";

console.log("ENV BASE URL =", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("REQUEST BASE =", config.baseURL);
  console.log("REQUEST URL =", config.url);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;