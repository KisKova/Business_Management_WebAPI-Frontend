import api from "./api.js"

/**************** User requests ****************/

// Login user
export const loginUser = async (identifier, password) => {
    return api.post(`/login`, { identifier, password });
};

// Change password
export const changeUserPassword = async (oldPassword, newPassword) => {
    const userId = localStorage.getItem("userId"); // Store and retrieve userId

    console.log(oldPassword, newPassword);

    return api.put(`/change-password`,
        { oldPassword, newPassword, userId }
    );
};

// Change user password (Admin only)
export const changeUserPasswordAdmin = async (updatedData) => {
    console.log(updatedData);

    return api.put(`/users/${updatedData.id}/password`, updatedData);
};

// Change personal data
export const changePersonalData = async (email, username) => {
    const userId = localStorage.getItem("userId");

    console.log("This is the info that will be sent: " + email + username)

    return api.put(`/change-personal-data`,
        { email, username, userId }
    );
}

// Fetch all user (Admin only)
export const fetchAllUsers = async () => {
    return api.get(`/users`);
};

// Create user/admin (Admin only)
export const createUser = async (userData) => {
    return api.post(`/create-user`, userData);
};

// Update User data (Admin only)
export const updateUser = async (updatedData) => {
    return api.put(`/users/${updatedData.userId}`, updatedData);
};