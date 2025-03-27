import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { fetchAllCustomers, createCustomer } from "../services/api";
import { toast } from "react-toastify";
import "../App.css";

Modal.setAppElement("#root");

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
    const [currentPage, setCurrentPage] = useState(1);
    const customersPerPage = 10;

    const totalPages = Math.ceil(customers.length / customersPerPage);
    const paginatedCustomers = customers.slice(
        (currentPage - 1) * customersPerPage,
        currentPage * customersPerPage
    );



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

    const handleCreateCustomer = async (e) => {
        e.preventDefault();
        try {
            await createCustomer(customerData);
            toast.success("Customer created successfully!");
            closeModal();
            const response = await fetchAllCustomers();
            setCustomers(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error creating customer.");
        }
    };

    return (
        <div className="admin-container">
            <h2>Customer Management</h2>
            <button onClick={() => setModalType("createCustomer")} className="create-user-button">
                + Create Customer
            </button>

            <table className="admin-table">
                <thead className="admin-thead">
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
                {paginatedCustomers.map((customer) => (
                    <tr key={customer.id} className="admin-trow">
                        <td>{customer.id}</td>
                        <td>{customer.name}</td>
                        <td>{customer.hourly_fee} €</td>
                        <td>{customer.billing_type}</td>
                        <td>{customer.invoice_type}</td>
                        <td>{customer.tax_number}</td>
                        <td>
                            <button
                                onClick={() => navigate(`/customers/${customer.id}`)}
                                className="edit-button"
                            >
                                Edit
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="pagination-container">
                <button
                    className="pagination-button"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        className={`pagination-button ${currentPage === i + 1 ? "active" : ""}`}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    className="pagination-button"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>


            <Modal
                isOpen={modalType === "createCustomer"}
                onRequestClose={closeModal}
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h3>Create New Customer</h3>
                <form onSubmit={handleCreateCustomer} className="admin-form">
                    <label>Name:</label>
                    <input type="text" value={customerData.name}
                           className="admin-input"
                           onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })} required />

                    <label>Hourly Fee (€):</label>
                    <input type="number" value={customerData.hourly_fee}
                           className="admin-input"
                           onChange={(e) => setCustomerData({ ...customerData, hourly_fee: e.target.value })} required />

                    <label>Billing Type:</label>
                    <select value={customerData.billing_type}
                            className="admin-input"
                            onChange={(e) => setCustomerData({ ...customerData, billing_type: e.target.value })}>
                        <option value="hourly">Hourly</option>
                        <option value="monthly">Monthly</option>
                    </select>

                    <label>Invoice Type:</label>
                    <input type="text" value={customerData.invoice_type}
                           className="admin-input"
                           onChange={(e) => setCustomerData({ ...customerData, invoice_type: e.target.value })} required />

                    <label>Tax Number:</label>
                    <input type="text" value={customerData.tax_number}
                           className="admin-input"
                           onChange={(e) => setCustomerData({ ...customerData, tax_number: e.target.value })} required />

                    <button type="submit" className="submit-button">Create</button>
                    <button type="button" onClick={closeModal} className="cancel-button">Cancel</button>
                </form>
            </Modal>
        </div>
    );
};

export default AdminCustomers;
