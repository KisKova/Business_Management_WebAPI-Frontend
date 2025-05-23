import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData] = useState(() => {
        const storedUser = localStorage.getItem("userData");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        if (!userData) {
            navigate("/login");
        }
    }, [userData, navigate]);

    if (!userData) return <p>Loading...</p>;

    return (
        <div className="admin-container">
            <h2>Welcome, {userData.username}!</h2>
            <p>Your role: <strong>{userData.role}</strong></p>

            {userData.role === "admin" ? (
                <button onClick={() => navigate("/admin-dashboard")} className="create-user-button">
                    Go to Admin Panel
                </button>
            ) : (
                <button onClick={() => navigate("/profile")} className="create-user-button">
                    View Profile
                </button>
            )}
        </div>
    );
};

export default Dashboard;
