import { useParams, useNavigate } from "react-router-dom";
import { useCustomerEdit } from "../../hooks/useCustomers";
import "../../App.css";

const CustomerEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        customerData,
        setCustomerData,
        users,
        assignedUsers,
        selectedUser,
        setSelectedUser,
        handleCustomerUpdate,
        handleAssignUser,
        handleRemoveUser
    } = useCustomerEdit(id, navigate);

    return (
        <div className="customer-edit-container">
            <h2>Edit Customer</h2>

            <form onSubmit={handleCustomerUpdate} className="customer-edit-form">
                <label>Name:</label>
                <input
                    type="text"
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                    required
                />

                <label>Hourly Fee (€):</label>
                <input
                    type="number"
                    value={customerData.hourly_fee}
                    onChange={(e) => setCustomerData({ ...customerData, hourly_fee: e.target.value })}
                    required
                />

                <label>Billing Type:</label>
                <select
                    value={customerData.billing_type}
                    onChange={(e) => setCustomerData({ ...customerData, billing_type: e.target.value })}
                >
                    <option value="hourly">Hourly</option>
                    <option value="monthly">Monthly</option>
                </select>

                <label>Invoice Type:</label>
                <input
                    type="text"
                    value={customerData.invoice_type}
                    onChange={(e) => setCustomerData({ ...customerData, invoice_type: e.target.value })}
                    required
                />

                <label>Tax Number:</label>
                <input
                    type="text"
                    value={customerData.tax_number}
                    onChange={(e) => setCustomerData({ ...customerData, tax_number: e.target.value })}
                    required
                />

                <button type="submit" className="customer-edit-btn-primary">Save</button>
                <button type="button" onClick={() => navigate("/customers")} className="customer-edit-btn-cancel">
                    Back to customers
                </button>
            </form>

            <h3>Assign Users to Customer</h3>
            <div className="customer-edit-assign">
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="customer-edit-select">
                    <option value="">Select a user</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.username} ({user.role})
                        </option>
                    ))}
                </select>
                <button onClick={handleAssignUser} className="customer-edit-btn-primary">Assign User</button>
            </div>

            <h4>Assigned Users:</h4>
            <ul className="customer-edit-user-list">
                {assignedUsers.map((user) => (
                    <li key={user.id} className="customer-edit-user-item">
                        {user.username} ({user.role})
                        <button
                            onClick={() => handleRemoveUser(user.id)}
                            className="customer-edit-btn-remove"
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CustomerEdit;
