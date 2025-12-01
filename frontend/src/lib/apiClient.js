// frontend/src/lib/apiClient.js
import axios from 'axios';

// Base URL for the Node.js backend
const API_URL = 'http://localhost:3000/api'; 

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to attach token to every request (for protected routes)
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default apiClient;