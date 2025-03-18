import axios from "axios";

const API_URL = "http://localhost:5001/auth";  // Adjust to match your backend

export const registerUser = async (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

// Login user
export const loginUser = async (identifier, password) => {
    return axios.post(`${API_URL}/login`, { identifier, password });
};

// Update profile
export const updateUserProfile = async (updatedData) => {
    const token = localStorage.getItem("authToken");

    return axios.put(`${API_URL}/profile`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Change password
export const changeUserPassword = async (oldPassword, newPassword) => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId"); // Store and retrieve userId

    console.log(oldPassword, newPassword);

    return axios.put(`${API_URL}/change-password`,
        { oldPassword, newPassword, userId }, // Send userId with old/new password
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
};

export const changeUserPasswordAdmin = async (updatedData) => {
    const token = localStorage.getItem("authToken");

    console.log(updatedData);

    return axios.put(`${API_URL}/users/${updatedData.id}/password`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const changePersonalData = async (email, username) => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    console.log("This is the info that will be sent: " + email + username)

    return axios.put(`${API_URL}/change-personal-data`,
        { email, username, userId }, // Send userId with old/new password
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
}

export const changePassword = async (token, passwordData) => {
    return axios.put(`${API_URL}/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const fetchAllUsers = async () => {
    const token = localStorage.getItem("authToken");
    return axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const createUser = async (userData) => {
    const token = localStorage.getItem("authToken");
    return axios.post(`${API_URL}/create-user`, userData, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// Update User data (Admin Only)
export const updateUser = async (updatedData) => {
    const token = localStorage.getItem("authToken");

    return axios.put(`${API_URL}/users/${updatedData.userId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const fetchAllCustomers = async () => {
    const token = localStorage.getItem("authToken");
    return axios.get(`${API_URL}/customers`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const createCustomer = async (customerData) => {
    const token = localStorage.getItem("authToken");
    return axios.post(`${API_URL}/customers`, customerData, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const updateCustomer = async (customerId, updatedData) => {
    const token = localStorage.getItem("authToken");
    return axios.put(`${API_URL}/customers/${customerId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const fetchCustomerById = async (customerId) => {
    const token = localStorage.getItem("authToken");
    return axios.get(`${API_URL}/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const fetchUsersByCustomerId = async (customerId) => {
    const token = localStorage.getItem("authToken");
    return axios.get(`${API_URL}/customers/${customerId}/users`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const assignUserToCustomer = async (customerId, userId) => {
    const token = localStorage.getItem("authToken");
    return axios.post(`${API_URL}/customers/${customerId}/users`, { user_id: userId }, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const removeUserFromCustomer = async (customerId, userId) => {
    const token = localStorage.getItem("authToken");
    return axios.delete(`${API_URL}/customers/${customerId}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// ✅ Fetch all tasks
export const fetchAllTasks = async () => {
    const token = localStorage.getItem("authToken");
    return axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// ✅ Create a new task
export const createTask = async (taskName) => {
    const token = localStorage.getItem("authToken");
    return axios.post(`${API_URL}/tasks`, { name: taskName }, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// ✅ Update an existing task
export const updateTask = async (taskId, taskName) => {
    const token = localStorage.getItem("authToken");
    return axios.put(`${API_URL}/tasks/${taskId}`, { name: taskName }, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// ✅ Delete a task
export const deleteTask = async (taskId) => {
    const token = localStorage.getItem("authToken");
    return axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// ✅ Fetch all projects
export const fetchAllProjects = async () => {
    const token = localStorage.getItem("authToken");
    return axios.get(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// ✅ Create a new project
export const createProject = async (projectName) => {
    const token = localStorage.getItem("authToken");
    return axios.post(`${API_URL}/projects`, { name: projectName }, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// ✅ Update an existing project
export const updateProject = async (projectId, projectName) => {
    const token = localStorage.getItem("authToken");
    return axios.put(`${API_URL}/projects/${projectId}`, { name: projectName }, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// ✅ Delete a project
export const deleteProject = async (projectId) => {
    const token = localStorage.getItem("authToken");
    return axios.delete(`${API_URL}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// ✅ Start tracking
export const startTracking = async (note) => {
    const token = localStorage.getItem("authToken");
    return axios.post(`${API_URL}/time-tracking/start`, { note }, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// ✅ Stop tracking (requires project, task, customer)
export const stopTracking = async (trackingId, projectId, taskId, customerId) => {
    const token = localStorage.getItem("authToken");
    return axios.post(`${API_URL}/time-tracking/stop`, { id: trackingId, project_id: projectId, task_id: taskId, customer_id: customerId }, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// ✅ Get active tracking session
export const getActiveTracking = async () => {
    const token = localStorage.getItem("authToken");
    return axios.get(`${API_URL}/time-tracking/active`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// ✅ Get assigned customers for the user
export const getAssignedCustomers = async () => {
    const token = localStorage.getItem("authToken");
    return axios.get(`${API_URL}/time-tracking/assigned-customers`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// ✅ Fetch Time Trackings (User sees their own, Admin sees all)
export const fetchTimeTrackings = async () => {
    const token = localStorage.getItem("authToken");
    return axios.get(`${API_URL}/time-tracking`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// ✅ Fetch Active/Ongoing Time Trackings
export const fetchActiveTrackings = async () => {
    const token = localStorage.getItem("authToken");
    return axios.get(`${API_URL}/time-tracking/active`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const fetchAllActiveTrackings = async () => {
    const token = localStorage.getItem("authToken");
    return axios.get(`${API_URL}/time-tracking/all-active`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
