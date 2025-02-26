import axios from "axios";

// Base API URL
const API_BASE_URL = import.meta.env.API_BASE_URL; 

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Set timeout for API requests
});

// ✅ Request Interceptor (Runs before every request)
api.interceptors.request.use(
  (config) => {
    // Add Authorization token if available
    const token = localStorage.getItem("authToken"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor (Runs after receiving a response)
api.interceptors.response.use(
  (response) => {
    return response.data; // Return only the data instead of the full response object
  },
  (error) => {
    // Handle global errors
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Unauthorized! Redirecting to login...");
        localStorage.removeItem("authToken"); // Clear token
        window.location.href = "/login"; // Redirect to login page
      } else if (error.response.status === 403) {
        console.error("Forbidden! Access Denied.");
      } else if (error.response.status === 500) {
        console.error("Server Error! Please try again later.");
      }
    } else if (error.request) {
      console.error("No response from server. Please check your connection.");
    } else {
      console.error("Request error: ", error.message);
    }
    return Promise.reject(error);
  }
);

// ✅ Common API Service Functions
export const apiService = {
  get: (url, params) => api.get(url, { params }),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  patch: (url, data) => api.patch(url, data),
  delete: (url) => api.delete(url),
};

export default api;
