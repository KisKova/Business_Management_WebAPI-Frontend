import api from "./api.js"

/**************** Task requests ****************/

// Fetch all tasks (Admin only)
export const fetchAllTasks = async () => {
    return api.get(`/tasks`);
};

// Create a new task (Admin only)
export const createTask = async (taskName) => {
    return api.post(`/tasks`, { name: taskName });
};

// Update an existing task (Admin only)
export const updateTask = async (taskId, taskName) => {
    return api.put(`/tasks/${taskId}`, { name: taskName });
};

// Delete a task (Admin only)
export const deleteTask = async (taskId) => {
    return api.delete(`/tasks/${taskId}`);
};