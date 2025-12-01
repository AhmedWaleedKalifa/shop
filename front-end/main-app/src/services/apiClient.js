import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true,
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // automatic redirect
    }

    if (status === 403) {
      console.warn("Permission denied: Admin only");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
