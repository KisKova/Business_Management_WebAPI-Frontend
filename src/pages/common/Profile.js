import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { changePersonalData, changeUserPassword } from "../../services/userService";

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
            toast.success("Password changed successfully!");
            setPasswords({ oldPassword: "", newPassword: "" });
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error changing password.");
        }
    };

    const handlePersonalDataUpdate = async (e) => {
        e.preventDefault();
        try {
            await changePersonalData(personalData.email, personalData.username);
            toast.success("Personal Info updated successfully!");
            const updatedUserData = { ...userData, ...personalData };
            setUserData(updatedUserData);
            localStorage.setItem("userData", JSON.stringify(updatedUserData));
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error changing personal data.");
        }
    };

    if (!userData) return <p>Loading...</p>;

    return (
        <div className="profile-container">
            <h2>Profile</h2>

            <div className="profile-card">
                <p><strong>Username:</strong> {userData.username}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Role:</strong> {userData.role}</p>
            </div>

            <button onClick={() => openModal("password")} className="profile-button">Change Password</button>
            <button onClick={() => openModal("personalData")} className="profile-button">Change Personal Info</button>

            {/* Password Change Modal */}
            <Modal
                isOpen={modalType === "password"}
                onRequestClose={closeModal}
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordUpdate} className="admin-form">
                    <input type="password" name="oldPassword" placeholder="Current Password" value={passwords.oldPassword} onChange={handlePasswordChange} required className="admin-input" />
                    <input type="password" name="newPassword" placeholder="New Password" value={passwords.newPassword} onChange={handlePasswordChange} required className="admin-input" />
                    <button type="submit" className="submit-button">Update Password</button>
                    <button type="button" onClick={closeModal} className="cancel-button">Cancel</button>
                </form>
            </Modal>

            {/* Personal Data Update Modal */}
            <Modal
                isOpen={modalType === "personalData"}
                onRequestClose={closeModal}
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h3>Change Personal Info</h3>
                <form onSubmit={handlePersonalDataUpdate} className="admin-form">
                    <input type="email" name="email" placeholder="Email" value={personalData.email} onChange={handlePersonalDataChange} className="admin-input" />
                    <input type="text" name="username" placeholder="Username" value={personalData.username} onChange={handlePersonalDataChange} className="admin-input" />
                    <button type="submit" className="submit-button">Update</button>
                    <button type="button" onClick={closeModal} className="cancel-button">Cancel</button>
                </form>
            </Modal>
        </div>
    );
};

export default Profile;