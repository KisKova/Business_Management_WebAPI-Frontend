import api from "./api.js"

/**************** Customer requests ****************/

// Fetch all customer (Admin only)
export const fetchAllCustomers = async () => {
    return api.get(`/customers`);
};

// Create customer (Admin only)
export const createCustomer = async (customerData) => {
    return api.post(`/customers`, customerData);
};

// Update customer (Admin only)
export const updateCustomer = async (customerId, updatedData) => {
    return api.put(`/customers/${customerId}`, updatedData);
};

// Fetching customer by id (Admin only)
export const fetchCustomerById = async (customerId) => {
    return api.get(`/customers/${customerId}`);
};

// Fetching users assigned to a customer (Admin only)
export const fetchUsersByCustomerId = async (customerId) => {
    return api.get(`/customers/${customerId}/users`);
};

// Assign user to a customer (Admin only)
export const assignUserToCustomer = async (customerId, userId) => {
    return api.post(`/customers/${customerId}/users`, { user_id: userId });
};

// Remove user from a customer (Admin only)
export const removeUserFromCustomer = async (customerId, userId) => {
    return api.delete(`/customers/${customerId}/users/${userId}`);
};