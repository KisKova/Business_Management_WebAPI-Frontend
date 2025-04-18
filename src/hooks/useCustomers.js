import { useState, useEffect } from "react";
import { fetchAllCustomers, createCustomer } from "../services/customerService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
