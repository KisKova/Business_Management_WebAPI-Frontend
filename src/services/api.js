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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.data.message === "Invalid token")) {
            console.warn("Invalid token detected, redirecting to login...");

            // Clear localStorage
            localStorage.removeItem("authToken");
            localStorage.removeItem("userData");

            // Redirect to login page
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
