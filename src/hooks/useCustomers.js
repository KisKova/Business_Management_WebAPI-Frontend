import { useState, useEffect } from "react";
import {
    fetchAllCustomers,
    createCustomer,
    fetchCustomerById,
    fetchUsersByCustomerId, updateCustomer, assignUserToCustomer, removeUserFromCustomer
} from "../services/customerService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {fetchAllUsers} from "../services/userService";
import {fetchCustomerSummary} from "../services/timeTrackingService";

export const useCustomers = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [customerData, setCustomerData] = useState({
        name: "",
        hourly_fee: "",
        billing_type: "hourly",
        invoice_type: "",
        tax_number: ""
    });

    useEffect(() => {
        let didCancel = false;
        const loadCustomers = async () => {
            if (didCancel) return;
            try {
                const response = await fetchAllCustomers();
                setCustomers(response.data.data);
            } catch (error) {
                toast.error("Failed to fetch customers.");
                navigate("/login");
            }
        };
        loadCustomers();
        return () => { didCancel = true };
    }, [navigate]);

    const closeModal = () => setModalType(null);

    const handleCreateCustomer = async (e) => {
        e.preventDefault();
        try {
            await createCustomer(customerData);
            toast.success("Customer created successfully!");
            closeModal();
            const response = await fetchAllCustomers();
            setCustomers(response.data.data);
        } catch (error) {
            toast.error(error.response?.data.message || "Error creating customer.");
        }
    };

    return {
        customers,
        setCustomers,
        modalType,
        setModalType,
        customerData,
        setCustomerData,
        closeModal,
        handleCreateCustomer
    };
};

export const useCustomerEdit = (id, navigate) => {
    const [customerData, setCustomerData] = useState({
        name: "",
        hourly_fee: "",
        billing_type: "hourly",
        invoice_type: "",
        tax_number: ""
    });
    const [users, setUsers] = useState([]);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");

    useEffect(() => {
        const loadCustomer = async () => {
            try {
                const response = await fetchCustomerById(id);
                setCustomerData(response.data.data);

                const userResponse = await fetchAllUsers();
                setUsers(userResponse.data.data);

                const assignedUsersResponse = await fetchUsersByCustomerId(id);
                setAssignedUsers(assignedUsersResponse.data.data);
            } catch (error) {
                toast.error("Failed to fetch customer data.");
            }
        };
        loadCustomer();
    }, [id]);

    const handleCustomerUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateCustomer(id, customerData);
            toast.success("Customer updated successfully!");
            navigate("/customers");
        } catch (error) {
            toast.error("Error updating customer.");
        }
    };

    const handleAssignUser = async () => {
        if (!selectedUser) {
            toast.error("Please select a user to assign.");
            return;
        }
        try {
            await assignUserToCustomer(id, selectedUser);
            toast.success("User assigned successfully!");
            const assignedUsersResponse = await fetchUsersByCustomerId(id);
            setAssignedUsers(assignedUsersResponse.data.data);
        } catch (error) {
            toast.error("Error assigning user.");
        }
    };

    const handleRemoveUser = async (userId) => {
        try {
            await removeUserFromCustomer(id, userId);
            toast.success("User removed successfully!");
            const assignedUsersResponse = await fetchUsersByCustomerId(id);
            setAssignedUsers(assignedUsersResponse.data.data);
        } catch (error) {
            toast.error("Error removing user.");
        }
    };

    return {
        customerData,
        setCustomerData,
        users,
        assignedUsers,
        selectedUser,
        setSelectedUser,
        handleCustomerUpdate,
        handleAssignUser,
        handleRemoveUser
    };
};

export const useCustomerSummary = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [summary, setSummary] = useState([]);

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const res = await fetchAllCustomers();
                setCustomers(res.data.data);
            } catch {
                toast.error("Failed to load customers");
            }
        };
        loadCustomers();
    }, []);

    useEffect(() => {
        if (!selectedCustomerId) return;

        const loadSummary = async () => {
            try {
                const res = await fetchCustomerSummary(selectedCustomerId);
                setSummary(res.data.data);
            } catch {
                toast.error("Failed to load summary");
            }
        };
        loadSummary();
    }, [selectedCustomerId]);

    return {
        customers,
        selectedCustomerId,
        setSelectedCustomerId,
        summary
    };
};

