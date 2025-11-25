import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach access token
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: auto-refresh
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        const res = await axios.post(`${BASE_URL}api/token/refresh/`, { refresh });
        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return axiosInstance(original);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
