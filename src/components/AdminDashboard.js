import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import {
    fetchAllUsers,
    createUser,
    updateUser,
    changeUserPasswordAdmin,
} from "../services/api";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userData, setUserData] = useState({
        id: "",
        username: "",
        email: "",
        role: "user",
        is_active: true,
    });
    const [newPasswordData, setNewPasswordData] = useState({
        id: "",
        newPassword: "",
    });
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        role: "user",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const totalPages = Math.ceil(users.length / usersPerPage);
    const paginatedUsers = users.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );


    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await fetchAllUsers();
                setUsers(response.data);
            } catch (error) {
                toast.error("Failed to fetch users.");
                navigate("/login");
            }
        };
        loadUsers();
    }, [navigate]);

    const openModal = (type, user = null) => {
        setModalType(type);
        setSelectedUser(user);
        if (type === "editUser" && user) {
            setUserData({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                is_active: user.is_active,
            });
        }
        if (type === "changePassword" && user) {
            setNewPasswordData({ id: user.id, newPassword: "" });
        }
    };

    const closeModal = () => setModalType(null);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await createUser(newUser);
            toast.success("User created successfully!");
            setModalType(null);
            setNewUser({ username: "", email: "", password: "", role: "user" });
            const response = await fetchAllUsers();
            setUsers(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error creating user.");
        }
    };

    const handleUserUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateUser(userData);
            toast.success("User updated successfully!");
            closeModal();
            const response = await fetchAllUsers();
            setUsers(response.data);
        } catch (error) {
            toast.error("Error updating user.");
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        try {
            await changeUserPasswordAdmin(newPasswordData);
            toast.success("Password changed successfully!");
            closeModal();
            setNewPasswordData({ id: "", newPassword: "" });
        } catch (error) {
            toast.error("Error changing password.");
        }
    };

    return (
        <div className="admin-container">
            <h2>Admin Dashboard</h2>
            <button onClick={() => openModal("createUser")} className="create-user-button">
                + Create User
            </button>

            <table className="admin-table">
                <thead className="admin-thead">
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
                {paginatedUsers.map((user) => (
                    <tr key={user.id} className="admin-trow">
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td className={user.is_active ? "admin-status-active" : "admin-status-inactive"}>
                            {user.is_active ? "Active" : "Deactive"}
                        </td>
                        <td>
                            <button
                                onClick={() => openModal("editUser", user)}
                                className="edit-user-button"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => openModal("changePassword", user)}
                                className="change-password-button"
                            >
                                Change Password
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



            {/* Create User Modal */}
            <Modal
                isOpen={modalType === "createUser"}
                onRequestClose={closeModal}
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h3>Create New User</h3>
                <form onSubmit={handleCreateUser} className="admin-form">
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        className="admin-input"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        required
                    />

                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        className="admin-input"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                    />

                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        className="admin-input"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                    />

                    <label>Role:</label>
                    <select
                        name="role"
                        className="admin-input"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button type="submit" className="submit-button">Create</button>
                    <button type="button" className="cancel-button" onClick={closeModal}>Cancel</button>
                </form>
            </Modal>

            {/* Edit User Modal */}
            <Modal
                isOpen={modalType === "editUser"}
                onRequestClose={closeModal}
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h3>Edit User</h3>
                <form onSubmit={handleUserUpdate} className="admin-form">
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        className="admin-input"
                        value={userData.username}
                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                        required
                    />

                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        className="admin-input"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        required
                    />

                    <label>Role:</label>
                    <select
                        name="role"
                        className="admin-input"
                        value={userData.role}
                        onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    <label>Status:</label>
                    <select
                        name="is_active"
                        className="admin-input"
                        value={userData.is_active ? "true" : "false"}
                        onChange={(e) => setUserData({ ...userData, is_active: e.target.value === "true" })}
                    >
                        <option value="true">Active</option>
                        <option value="false">Deactive</option>
                    </select>

                    <button type="submit" className="submit-button">Save</button>
                    <button type="button" className="cancel-button" onClick={closeModal}>Cancel</button>
                </form>
            </Modal>

            {/* Change Password Modal */}
            <Modal
                isOpen={modalType === "changePassword"}
                onRequestClose={closeModal}
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordUpdate} className="admin-form">
                    <label>New Password:</label>
                    <input
                        type="password"
                        className="admin-input"
                        value={newPasswordData.newPassword}
                        onChange={(e) =>
                            setNewPasswordData({ ...newPasswordData, newPassword: e.target.value })
                        }
                        required
                    />
                    <button type="submit" className="submit-button">Change</button>
                    <button type="button" className="cancel-button" onClick={closeModal}>Cancel</button>
                </form>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
