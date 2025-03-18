import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { changePersonalData, changeUserPassword } from "../services/api";

Modal.setAppElement("#root");

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(() => {
        // Load user data from localStorage on component mount
        const storedUser = localStorage.getItem("userData");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [modalType, setModalType] = useState(null);
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
    const [personalData, setPersonalData] = useState({ username: "", email: "" });
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Fetch user data from localStorage on page change
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        } else {
            setUserData(null);
        }
    }, [navigate]);

    // ✅ Fix: Set default values when opening the modal
    const openModal = (type) => {
        setModalType(type);

        if (type === "personalData" && userData) {
            setPersonalData({ username: userData.username, email: userData.email });
            console.log(userData.username + " and " + userData.email);
        }
    };

    const closeModal = () => setModalType(null);

    const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

    const handlePersonalDataChange = (e) => setPersonalData({ ...personalData, [e.target.name]: e.target.value });

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        try {
            await changeUserPassword(passwords.oldPassword, passwords.newPassword);
            setMessage("Password changed successfully!");
            setPasswords({ oldPassword: "", newPassword: "" });
            closeModal();
        } catch (error) {
            setMessage(error.response?.data?.message || "Error changing password.");
        }
    };

    const handlePersonalDataUpdate = async (e) => {
        e.preventDefault();
        try {
            await changePersonalData(personalData.email, personalData.username);
            setMessage("Personal Info changed successfully!");

            // Update local storage & UI with new user data
            const updatedUserData = { ...userData, ...personalData };
            console.log(updatedUserData);
            setUserData(updatedUserData);
            localStorage.setItem("userData", JSON.stringify(updatedUserData));

            closeModal();
        } catch (error) {
            setMessage(error.response?.data?.message || "Error changing personal data.");
        }
    };

    if (!userData) return <p>Loading...</p>;

    return (
        <div style={styles.container}>
            <h2>Profile</h2>
            {message && <p style={styles.message}>{message}</p>}

            <div style={styles.profileCard}>
                <p><strong>Username:</strong> {userData.username}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Role:</strong> {userData.role}</p>
            </div>

            <button onClick={() => openModal("password")} style={styles.button}>Change Password</button>

            {/* Password Change Modal */}
            <Modal isOpen={modalType === "password"} onRequestClose={closeModal} style={styles.modal}>
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordUpdate} style={styles.form}>
                    <label>Current Password:</label>
                    <input type="password" name="oldPassword" value={passwords.oldPassword} onChange={handlePasswordChange} required />

                    <label>New Password:</label>
                    <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} required />

                    <button type="submit">Update Password</button>
                    <button type="button" onClick={closeModal}>Cancel</button>
                </form>
            </Modal>

            <button onClick={() => openModal("personalData")} style={styles.button}>Change Personal Info</button>

            {/* Personal Data Update Modal */}
            <Modal isOpen={modalType === "personalData"} onRequestClose={closeModal} style={styles.modal}>
                <h3>Change Personal Info</h3>
                <form onSubmit={handlePersonalDataUpdate} style={styles.form}>
                    <label>Email:</label>
                    <input type="email" name="email" value={personalData.email} onChange={handlePersonalDataChange} required />

                    <label>Username:</label>
                    <input type="text" name="username" value={personalData.username} onChange={handlePersonalDataChange} required />

                    <button type="submit">Update</button>
                    <button type="button" onClick={closeModal}>Cancel</button>
                </form>
            </Modal>
        </div>
    );
};

// Styles
const styles = {
    container: { textAlign: "center", marginTop: "50px", maxWidth: "400px", margin: "auto" },
    profileCard: { border: "1px solid #ddd", padding: "15px", borderRadius: "5px", marginBottom: "20px", background: "#f9f9f9" },
    button: { padding: "10px 15px", margin: "10px", fontSize: "16px", cursor: "pointer", borderRadius: "5px", background: "#007bff", color: "white", border: "none" },
    message: { color: "green", fontWeight: "bold" },
    modal: {
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        content: { width: "400px", height: "auto", margin: "auto", padding: "20px", borderRadius: "10px", textAlign: "center" },
    },
    form: { display: "flex", flexDirection: "column", gap: "10px" },
};

export default Profile;
