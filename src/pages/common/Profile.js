import Modal from "react-modal";
import { useProfile } from "../../hooks/useUsers"; // adjust the path if necessary

Modal.setAppElement("#root");

const Profile = () => {
    const {
        userData,
        modalType,
        openModal,
        closeModal,
        passwords,
        personalData,
        handlePasswordChange,
        handlePersonalDataChange,
        handlePasswordUpdate,
        handlePersonalDataUpdate
    } = useProfile();

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
                    <input
                        type="password"
                        name="oldPassword"
                        placeholder="Current Password"
                        value={passwords.oldPassword}
                        onChange={handlePasswordChange}
                        required
                        className="admin-input"
                    />
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="admin-input"
                    />
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
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={personalData.email}
                        onChange={handlePersonalDataChange}
                        className="admin-input"
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={personalData.username}
                        onChange={handlePersonalDataChange}
                        className="admin-input"
                    />
                    <button type="submit" className="submit-button">Update</button>
                    <button type="button" onClick={closeModal} className="cancel-button">Cancel</button>
                </form>
            </Modal>
        </div>
    );
};

export default Profile;
