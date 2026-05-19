import axios from "axios";
import { apiBaseUrl } from "./apiBase";

const api = axios.create({
  baseURL: apiBaseUrl,
});

// Ajoute automatiquement le token JWT dans les headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
