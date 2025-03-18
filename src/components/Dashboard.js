import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(() => {
        // Load user data from localStorage on component mount
        const storedUser = localStorage.getItem("userData");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        // If no user data exists in localStorage, redirect to login
        if (!userData) {
            navigate("/login");
        }
    }, [userData, navigate]);

    const handleLogout = () => {
        toast.info("Logged out from the API!");
        setUserData(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        navigate("/login");
    };

    if (!userData) return <p>Loading...</p>;

    return (
        <div style={styles.container}>
            <h2>Welcome, {userData.username}!</h2>
            <p>Your role: <strong>{userData.role}</strong></p>

            {userData.role === "admin" ? (
                <button onClick={() => navigate("/admin-dashboard")} style={styles.button}>
                    Go to Admin Panel
                </button>
            ) : (
                <button onClick={() => navigate("/profile")} style={styles.button}>
                    View Profile
                </button>
            )}

            <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
            </button>
        </div>
    );
};

const styles = {
    container: {
        textAlign: "center",
        marginTop: "50px"
    },
    button: {
        padding: "10px 20px",
        margin: "10px",
        fontSize: "16px",
        cursor: "pointer",
    },
    logoutButton: {
        backgroundColor: "red",
        color: "white",
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
        border: "none",
        borderRadius: "5px",
        marginTop: "20px"
    }
};

export default Dashboard;
