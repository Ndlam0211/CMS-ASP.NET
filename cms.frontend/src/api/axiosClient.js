import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
