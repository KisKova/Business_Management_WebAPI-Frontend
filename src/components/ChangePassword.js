import React, { useState } from "react";
import { changePassword } from "../services/api";

const ChangePassword = ({ token }) => {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await changePassword(token, { newPassword });
            setMessage("Password updated successfully!");
        } catch (error) {
            setMessage("Failed to update password.");
        }
    };

    return (
        <div>
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit}>
                <input type="password" placeholder="New Password" onChange={(e) => setNewPassword(e.target.value)} required />
                <button type="submit">Change Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ChangePassword;
