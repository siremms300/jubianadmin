

import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Create axios instance with proper configuration
export const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

// Add token to requests automatically from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// In your api.js - Replace the interceptor with this improved version
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't handle 401 errors for login/register pages or auth endpoints
      const isAuthPage = window.location.pathname === '/login' || 
                         window.location.pathname === '/register';
      const isAuthEndpoint = error.config?.url?.includes('/api/users/login') || 
                            error.config?.url?.includes('/api/users/register');
      
      if (!isAuthPage && !isAuthEndpoint) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);




export const registerUser = async (userData) => {
  const response = await api.post('/api/users/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/api/users/login', credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/api/users/logout');
  return response.data;
};

export const verifyEmail = async (verificationData) => {
  const response = await api.post('/api/auth/verify-email', verificationData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/users/me');
  return response.data;
}; 


export const resetPassword = async (resetData) => {
  const response = await api.post('/api/users/reset-password', resetData);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/api/users/forgot-password', { email });
  return response.data;
};





