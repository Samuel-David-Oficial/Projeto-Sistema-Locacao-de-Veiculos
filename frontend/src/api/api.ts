import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

let onUnauthorized = () => window.location.replace("/login");

export function setOnUnauthorized(callback: () => void) {
  onUnauthorized = callback;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const rotaPublica = ["/login", "/usuarios"].includes(error.config?.url);
    if (error.response?.status === 401 && !rotaPublica) {
      localStorage.removeItem("token");
      onUnauthorized();
    }
    return Promise.reject(error);
  },
);

export default api;
