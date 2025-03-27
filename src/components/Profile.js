import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { changePersonalData, changeUserPassword } from "../services/api";

Modal.setAppElement("#root");

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(() => {
        const storedUser = localStorage.getItem("userData");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [modalType, setModalType] = useState(null);
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
    const [personalData, setPersonalData] = useState({ username: "", email: "" });
    const [message, setMessage] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }
    }, [navigate]);

    const openModal = (type) => {
        setModalType(type);
        if (type === "personalData" && userData) {
            setPersonalData({ username: userData.username, email: userData.email });
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
            setMessage("Personal Info updated successfully!");
            const updatedUserData = { ...userData, ...personalData };
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
            <button onClick={() => openModal("personalData")} style={styles.button}>Change Personal Info</button>

            {/* Password Change Modal */}
            <Modal isOpen={modalType === "password"} onRequestClose={closeModal} style={styles.modal}>
                <div style={styles.modalContent}>
                    <h3>Change Password</h3>
                    <form onSubmit={handlePasswordUpdate} style={styles.form}>
                        <input type="password" name="oldPassword" placeholder="Current Password" value={passwords.oldPassword} onChange={handlePasswordChange} required style={styles.input} />
                        <input type="password" name="newPassword" placeholder="New Password" value={passwords.newPassword} onChange={handlePasswordChange} required style={styles.input} />
                        <div style={styles.buttonContainer}>
                            <button type="submit" style={styles.submitButton}>Update Password</button>
                            <button type="button" onClick={closeModal} style={styles.cancelButton}>Cancel</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Personal Data Update Modal */}
            <Modal isOpen={modalType === "personalData"} onRequestClose={closeModal} style={styles.modal}>
                <div style={styles.modalContent}>
                    <h3>Change Personal Info</h3>
                    <form onSubmit={handlePersonalDataUpdate} style={styles.form}>
                        <input type="email" name="email" placeholder="Email" value={personalData.email} onChange={handlePersonalDataChange} required style={styles.input} />
                        <input type="text" name="username" placeholder="Username" value={personalData.username} onChange={handlePersonalDataChange} required style={styles.input} />
                        <div style={styles.buttonContainer}>
                            <button type="submit" style={styles.submitButton}>Update</button>
                            <button type="button" onClick={closeModal} style={styles.cancelButton}>Cancel</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

const styles = {
    container: { textAlign: "center", marginTop: "50px", maxWidth: "400px", margin: "auto" },
    profileCard: { border: "1px solid #ddd", padding: "15px", borderRadius: "8px", marginBottom: "20px", background: "#f9f9f9" },
    button: { padding: "10px 15px", margin: "10px", fontSize: "16px", boxShadow: "rgba(0, 0, 0, 0.16) 0px 2px 5px", cursor: "pointer", borderRadius: "5px", background: "#007bff", color: "white", border: "none" },
    message: { color: "green", fontWeight: "bold" },
    modal: { overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" }, content: { width: "400px", height: "220px", margin: "auto", padding: "40px", borderRadius: "10px", textAlign: "center" } },
    modalContent: { display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" },
    form: { display: "flex", flexDirection: "column", gap: "20px" },
    input: { padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px" },
    buttonContainer: { display: "flex", justifyContent: "space-between" },
    submitButton: { background: "#28a745", color: "white", padding: "10px 15px", boxShadow: "rgba(0, 0, 0, 0.16) 0px 2px 5px", fontSize: "16px", borderRadius: "5px", cursor: "pointer", border: "none" },
    cancelButton: { background: "#dc3545", color: "white", padding: "10px 15px", boxShadow: "rgba(0, 0, 0, 0.16) 0px 2px 5px", fontSize: "16px", borderRadius: "5px", cursor: "pointer", border: "none" },
};

export default Profile;