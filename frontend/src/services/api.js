import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'https://taskmanager-production-a6f0.up.railway.app')
  .replace(/\/$/, '');

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
