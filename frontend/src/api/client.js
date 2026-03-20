// src/api/client.js
import axios from "axios";

export const ENABLE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS === "true";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api"
});

export default api;
