import React, { useState } from "react";
import { adminChangePassword } from "../services/api";

const AdminChangePassword = ({ token }) => {
    const [userId, setUserId] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminChangePassword(token, userId, newPassword);
            setMessage("Password updated for user.");
        } catch (error) {
            setMessage("Failed to update user password.");
        }
    };

    return (
        <div>
            <h2>Admin Change Password</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="User ID" onChange={(e) => setUserId(e.target.value)} required />
                <input type="password" placeholder="New Password" onChange={(e) => setNewPassword(e.target.value)} required />
                <button type="submit">Change Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AdminChangePassword;
