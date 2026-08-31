import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3464/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem("auth-storage");

    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      const token = parsed?.state?.token;


      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;