import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCustomerById, updateCustomer, assignUserToCustomer, fetchUsersByCustomerId, removeUserFromCustomer } from "../../services/customerService";
import { fetchAllUsers } from "../../services/userService";
import { toast } from "react-toastify";

const CustomerEdit = () => {
    const { id } = useParams(); // Get customer ID from URL
    const navigate = useNavigate();

    const [customerData, setCustomerData] = useState({
        name: "",
        hourly_fee: "",
        billing_type: "hourly",
        invoice_type: "",
        tax_number: ""
    });

    const [users, setUsers] = useState([]); // All users
    const [assignedUsers, setAssignedUsers] = useState([]); // Users assigned to this customer
    const [selectedUser, setSelectedUser] = useState(""); // Selected user to assign

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

    // ✅ Handle customer update
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

    // ✅ Handle user assignment
    const handleAssignUser = async () => {
        if (!selectedUser) {
            toast.error("Please select a user to assign.");
            return;
        }
        try {
            await assignUserToCustomer(id, selectedUser);
            toast.success("User assigned successfully!");

            // Refresh assigned users list
            const assignedUsersResponse = await fetchUsersByCustomerId(id);
            setAssignedUsers(assignedUsersResponse.data.data);
        } catch (error) {
            toast.error("Error assigning user.");
        }
    };

    // ✅ Handle user removal
    const handleRemoveUser = async (userId) => {
        try {
            await removeUserFromCustomer(id, userId);
            toast.success("User removed successfully!");

            // Refresh assigned users list
            const assignedUsersResponse = await fetchUsersByCustomerId(id);
            setAssignedUsers(assignedUsersResponse.data.data);
        } catch (error) {
            toast.error("Error removing user.");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Edit Customer</h2>

            {/* Customer Form */}
            <form onSubmit={handleCustomerUpdate} style={styles.form}>
                <label>Name:</label>
                <input type="text" value={customerData.name} onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })} required />

                <label>Hourly Fee (€):</label>
                <input type="number" value={customerData.hourly_fee} onChange={(e) => setCustomerData({ ...customerData, hourly_fee: e.target.value })} required />

                <label>Billing Type:</label>
                <select value={customerData.billing_type} onChange={(e) => setCustomerData({ ...customerData, billing_type: e.target.value })}>
                    <option value="hourly">Hourly</option>
                    <option value="monthly">Monthly</option>
                </select>

                <label>Invoice Type:</label>
                <input type="text" value={customerData.invoice_type} onChange={(e) => setCustomerData({ ...customerData, invoice_type: e.target.value })} required />

                <label>Tax Number:</label>
                <input type="text" value={customerData.tax_number} onChange={(e) => setCustomerData({ ...customerData, tax_number: e.target.value })} required />

                <button type="submit" style={styles.buttonPrimary}>Save</button>
                <button type="button" onClick={() => navigate("/customers")} style={styles.buttonCancel}>Back to customers</button>
            </form>

            {/* Assign Users Section */}
            <h3>Assign Users to Customer</h3>
            <div style={styles.assignContainer}>
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} style={styles.select}>
                    <option value="">Select a user</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.username} ({user.role})</option>
                    ))}
                </select>
                <button onClick={handleAssignUser} style={styles.buttonPrimary}>Assign User</button>
            </div>

            {/* Assigned Users List */}
            <h4>Assigned Users:</h4>
            <ul style={styles.userList}>
                {assignedUsers.map((user) => (
                    <li key={user.id} style={styles.userItem}>
                        {user.username} ({user.role})
                        <button onClick={() => handleRemoveUser(user.id)} style={styles.buttonRemove}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// ✅ Styles
const styles = {
    container: { textAlign: "center", padding: "20px", maxWidth: "600px", margin: "auto" },
    form: { display: "flex", flexDirection: "column", gap: "10px" },
    assignContainer: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" },
    input: { padding: "10px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "16px" },
    select: { padding: "10px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "16px" },
    buttonPrimary: { padding: "10px 15px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" },
    buttonCancel: { padding: "10px 15px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" },
    buttonRemove: { marginLeft: "10px", padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "14px" },
    userList: { listStyle: "none", padding: 0 },
    userItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", borderBottom: "1px solid #ddd" }
};

export default CustomerEdit;
