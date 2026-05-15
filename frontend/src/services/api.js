import axios from 'axios';

const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_BASE_URL = process.env.REACT_APP_API_URL || (isLocalHost ? 'http://localhost:5000/api' : '/api');

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
