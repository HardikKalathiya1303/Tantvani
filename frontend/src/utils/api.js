import axios from 'axios';

// In dev, Vite proxy routes /api → localhost:5000 (no env var needed)
// In production, set VITE_API_URL to your deployed backend URL
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);

export default api;
