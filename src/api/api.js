import axios from "axios";

// DOPO
const BASE_URL = "https://terapia-backend.onrender.com/api";

// Crea istanza axios
const api = axios.create({
  baseURL: BASE_URL,
});

// Aggiunge automaticamente il token ad ogni richiesta
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tm_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── AUTH ──────────────────────────────
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getProfile = () => api.get("/auth/profile");

// ── FARMACI ───────────────────────────
export const getDrugs = () => api.get("/drugs");
export const addDrug = (data) => api.post("/drugs", data);
export const takeDose = (drugId, data) => api.put(`/drugs/${drugId}/take`, data);
export const deleteDrug = (drugId) => api.delete(`/drugs/${drugId}`);

// ── MEDICO ────────────────────────────
export const getDoctor = () => api.get("/doctor");
export const saveDoctor = (data) => api.post("/doctor", data);