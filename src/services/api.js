import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";  // Adjust to match your backend

export const registerUser = async (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

export const loginUser = async ({ identifier, password }) => {
    return axios.post(`${API_URL}/login`, { identifier, password });
};

export const changePassword = async (token, passwordData) => {
    return axios.put(`${API_URL}/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
    });
};


export const adminChangePassword = async (token, userId, newPassword) => {
    return axios.put(`${API_URL}/admin/change-password`, { userId, newPassword }, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
