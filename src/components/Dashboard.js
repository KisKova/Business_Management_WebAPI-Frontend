import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { userRole, logout } = useAuth();

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {userRole === "admin" ? "Admin" : "User"}!</p>
            {userRole === "admin" ? (
                <div>
                    <h2>Admin Panel</h2>
                    <p>Manage users, settings, and more.</p>
                </div>
            ) : (
                <div>
                    <h2>User Panel</h2>
                    <p>View your account details and settings.</p>
                </div>
            )}
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Dashboard;
