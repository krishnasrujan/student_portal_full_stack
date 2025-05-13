// api/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your backend URL
});

// Simulated token injection (if needed)
API.interceptors.request.use(config => {
  config.headers.Authorization = 'Bearer dummy-token';
  return config;
});

export default API;
