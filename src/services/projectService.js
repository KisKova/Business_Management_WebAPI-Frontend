import api from "./api.js"

/**************** Project requests ****************/

// Fetch all projects
export const fetchAllProjects = async () => {
    return api.get(`/projects`);
};

// Create a new project
export const createProject = async (projectName) => {
    return api.post(`/projects`, { name: projectName });
};

// Update an existing project
export const updateProject = async (projectId, projectName) => {
    return api.put(`/projects/${projectId}`, { name: projectName });
};

// Delete a project
export const deleteProject = async (projectId) => {
    return api.delete(`/projects/${projectId}`);
};