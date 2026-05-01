import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Use relative path if proxied, but since we are running separately, use absolute URL for local dev
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
