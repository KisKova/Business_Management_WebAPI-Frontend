import { useNavigate } from "react-router-dom";
import { useCustomers } from "../../hooks/useCustomers";
import { usePagination } from "../../hooks/usePagination";
import "../../App.css";
import Modal from "react-modal";

const AdminCustomers = () => {
    const navigate = useNavigate();
    const {
        customers,
        modalType,
        setModalType,
        customerData,
        setCustomerData,
        closeModal,
        handleCreateCustomer
    } = useCustomers();

    const {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems: paginatedCustomers,
        nextPage,
        prevPage,
    } = usePagination(customers, 10);

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
                <button className="pagination-button" onClick={prevPage} disabled={currentPage === 1}>
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

                <button className="pagination-button" onClick={nextPage} disabled={currentPage === totalPages}>
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
