// services/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5001/auth", // use .env for flexibility
});

// Attach the token for all requests EXCEPT /login
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");

    // If token exists and the request is not to /login
    if (token && !config.url.endsWith("/login")) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
