import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach access token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token if 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axiosInstance.post("token/refresh/", { refresh });
        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return axiosInstance(original);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
