import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import {fetchAllUsers, createUser, updateUser, changeUserPasswordAdmin} from "../services/api";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userData, setUserData] = useState({ id: "", username: "", email: "", role: "user", is_active: true });
    const [newPasswordData, setNewPasswordData] = useState({id: "", newPassword: ""});
    const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "user" });

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await fetchAllUsers();
                console.log(response.data);
                setUsers(response.data);
            } catch (error) {
                toast.error("Failed to fetch users.");
                navigate("/login");
            }
        };
        loadUsers();
    }, [navigate]);

    // ✅ Open modal and set user data
    const openModal = (type, user = null) => {
        setModalType(type);
        setSelectedUser(user);
        console.log(selectedUser);
        if (type === "editUser" && user) {
            setUserData({id: user.id, username: user.username, email: user.email, role: user.role, is_active: user.is_active });
        }
        if (type === "changePassword" && user) {
            setNewPasswordData({id: user.id, newPassword: ""})
        }
    };

    const closeModal = () => setModalType(null);

    // ✅ Handle new user creation
    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await createUser(newUser);
            toast.success("User created successfully!");
            setModalType(null);
            setNewUser({ username: "", email: "", password: "", role: "user" });

            // Refresh user list
            const response = await fetchAllUsers();
            setUsers(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error creating user.");
        }
    };

    // ✅ Handle updating user info
    const handleUserUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateUser(userData);
            toast.success("User updated successfully!");
            closeModal();

            // Refresh user list
            const response = await fetchAllUsers();
            setUsers(response.data);
        } catch (error) {
            toast.error("Error updating user.");
        }
    };

    // ✅ Handle changing user password
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        try {
            console.log(newPasswordData);
            await changeUserPasswordAdmin(newPasswordData);
            toast.success("Password changed successfully!");
            closeModal();
            setNewPasswordData({id: "", newPassword: ""});
        } catch (error) {
            toast.error("Error changing password.");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Admin Dashboard</h2>
            <button onClick={() => openModal("createUser")} style={styles.createButton}>+ Create User</button>

            {/* Users List */}
            <table style={styles.table}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td style={{ color: user.is_active ? "green" : "red", fontWeight: "bold" }}>
                            {user.is_active ? "Active" : "Deactive"}
                        </td>
                        <td>
                            <button onClick={() => openModal("editUser", user)}>Edit</button>
                            <button onClick={() => openModal("changePassword", user)}>Change Password</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Create User Modal */}
            <Modal isOpen={modalType === "createUser"} onRequestClose={closeModal} style={styles.modal}>
                <h3>Create New User</h3>
                <form onSubmit={handleCreateUser} style={styles.form}>
                    <label>Username:</label>
                    <input type="text" name="username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required />

                    <label>Email:</label>
                    <input type="email" name="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />

                    <label>Password:</label>
                    <input type="password" name="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />

                    <label>Role:</label>
                    <select name="role" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button type="submit">Create</button>
                    <button type="button" onClick={closeModal}>Cancel</button>
                </form>
            </Modal>

            {/* Edit User Modal */}
            <Modal isOpen={modalType === "editUser"} onRequestClose={closeModal} style={styles.modal}>
                <h3>Edit User</h3>
                <form onSubmit={handleUserUpdate} style={styles.form}>
                    <label>Username:</label>
                    <input type="text" name="username" value={userData.username} onChange={(e) => setUserData({ ...userData, username: e.target.value })} required />

                    <label>Email:</label>
                    <input type="email" name="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} required />

                    <label>Role:</label>
                    <select name="role" value={userData.role} onChange={(e) => setUserData({ ...userData, role: e.target.value })}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    <label>Status:</label>
                    <select
                        name="is_active"
                        value={userData.is_active ? "true" : "false"}
                        onChange={(e) => setUserData({ ...userData, is_active: e.target.value === "true" })}
                    >
                        <option value="true">Active</option>
                        <option value="false">Deactive</option>
                    </select>

                    <button type="submit">Save</button>
                    <button type="button" onClick={closeModal}>Cancel</button>
                </form>
            </Modal>

            {/* Change Password Modal */}
            <Modal isOpen={modalType === "changePassword"} onRequestClose={closeModal} style={styles.modal}>
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordUpdate} style={styles.form}>
                    <label>New Password:</label>
                    <input type="password" value={newPasswordData.newPassword} onChange={(e) => setNewPasswordData( {...newPasswordData, newPassword: e.target.value})} required />
                    <button type="submit">Change</button>
                    <button type="button" onClick={closeModal}>Cancel</button>
                </form>
            </Modal>
        </div>
    );
};

// Styles
const styles = {
    container: { textAlign: "center", padding: "20px" },
    createButton: { padding: "10px 15px", fontSize: "16px",  backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "20px" },
    table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
    modal: { content: { width: "400px", margin: "auto", padding: "20px", textAlign: "center" } },
    form: { display: "flex", flexDirection: "column", gap: "10px" }
};

export default AdminDashboard;
