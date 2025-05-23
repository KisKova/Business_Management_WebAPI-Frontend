import api from "./api.js"


/**************** Time tracking requests ****************/

// Add manual tracking
export const addManualTracking = async (manualTracking) => {
    console.log(manualTracking);
    return api.post(`/time-tracking/manual`, manualTracking);
};

// Update a tracking
export const updateTracking = (id, data) => {
    return api.put(`/time-tracking/${id}`, data );
};

// Delete a tracking
export const deleteTracking = async (id) => {
    return api.delete(`/time-tracking/${id}`);
};

// Start tracking
export const startTracking = async (note) => {
    return api.post(`/time-tracking/start`, { note });
};

// Stop tracking (requires project, task, customer)
export const stopTracking = async (trackingId, projectId, taskId, customerId) => {
    return api.post(`/time-tracking/stop`, {
        id: trackingId,
        project_id: projectId,
        task_id: taskId,
        customer_id: customerId
    });
};

// Get active tracking session
export const getActiveTracking = async () => {
    return api.get(`/time-tracking/active`);
};

// Get assigned customers for the user
export const getAssignedCustomers = async () => {
    return api.get(`/time-tracking/assigned-customers`);
};

// Fetch time tracking (User sees their own, Admin sees all)
export const fetchTimeTracking = async () => {
    return api.get(`/time-tracking`);
};

// Fetch all active time tracking
export const fetchAllActiveTracking = async () => {
    return api.get(`/time-tracking/all-active`);
};

// Fetch customer cost summary
export const fetchCustomerSummary = async(customerId) => {
    return api.get(`/time-tracking/${customerId}/summary`);
};