import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllCustomers, createCustomer } from "../services/api";
import { toast } from "react-toastify";

const AdminCustomers = () => {
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
        const loadCustomers = async () => {
            try {
                const response = await fetchAllCustomers();
                setCustomers(response.data);
            } catch (error) {
                toast.error("Failed to fetch customers.");
                navigate("/login");
            }
        };
        loadCustomers();
    }, [navigate]);

    const closeModal = () => setModalType(null);

    // ✅ Handle new customer creation
    const handleCreateCustomer = async (e) => {
        e.preventDefault();
        try {
            await createCustomer(customerData);
            toast.success("Customer created successfully!");
            closeModal();

            // Refresh customer list
            const response = await fetchAllCustomers();
            setCustomers(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error creating customer.");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Customer Management</h2>
            <button onClick={() => setModalType("createCustomer")} style={styles.createButton}>
                + Create Customer
            </button>

            {/* Customers List */}
            <table style={styles.table}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Hourly Fee</th>
                    <th>Billing Type</th>
                    <th>Invoice Type</th>
                    <th>Tax Number</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {customers.map((customer) => (
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>{customer.name}</td>
                        <td>{customer.hourly_fee} €</td>
                        <td>{customer.billing_type}</td>
                        <td>{customer.invoice_type}</td>
                        <td>{customer.tax_number}</td>
                        <td>
                            <button onClick={() => navigate(`/customers/${customer.id}`)} style={styles.buttonEdit}>
                                Edit
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Create Customer Modal */}
            {modalType === "createCustomer" && (
                <div style={styles.modal}>
                    <h3>Create New Customer</h3>
                    <form onSubmit={handleCreateCustomer} style={styles.form}>
                        <label>Name:</label>
                        <input type="text" name="name" value={customerData.name}
                               onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })} required />

                        <label>Hourly Fee (€):</label>
                        <input type="number" name="hourly_fee" value={customerData.hourly_fee}
                               onChange={(e) => setCustomerData({ ...customerData, hourly_fee: e.target.value })} required />

                        <label>Billing Type:</label>
                        <select name="billing_type" value={customerData.billing_type}
                                onChange={(e) => setCustomerData({ ...customerData, billing_type: e.target.value })}>
                            <option value="hourly">Hourly</option>
                            <option value="monthly">Monthly</option>
                        </select>

                        <label>Invoice Type:</label>
                        <input type="text" name="invoice_type" value={customerData.invoice_type}
                               onChange={(e) => setCustomerData({ ...customerData, invoice_type: e.target.value })} required />

                        <label>Tax Number:</label>
                        <input type="text" name="tax_number" value={customerData.tax_number}
                               onChange={(e) => setCustomerData({ ...customerData, tax_number: e.target.value })} required />

                        <button type="submit">Create</button>
                        <button type="button" onClick={closeModal}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { textAlign: "center", padding: "20px", maxWidth: "900px", margin: "auto" },
    createButton: { padding: "10px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "20px", fontSize: "16px" },
    table: { width: "100%", borderCollapse: "collapse", marginTop: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px", overflow: "hidden", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" },
    th: { backgroundColor: "#007bff", color: "white", padding: "12px", textAlign: "left", fontWeight: "bold" },
    td: { padding: "10px", borderBottom: "1px solid #ddd", textAlign: "left" },
    buttonEdit: { padding: "5px 10px", backgroundColor: "#ffc107", color: "black", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "14px" },
    modal: { width: "400px", margin: "auto", padding: "20px", borderRadius: "10px", textAlign: "center", backgroundColor: "#fff", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" },
    form: { display: "flex", flexDirection: "column", gap: "10px" }
};

export default AdminCustomers;
