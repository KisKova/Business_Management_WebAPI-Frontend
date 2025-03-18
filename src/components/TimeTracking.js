import { useEffect, useState, useCallback } from "react";
import {fetchTimeTrackings, fetchAllActiveTrackings} from "../services/api";
import { toast } from "react-toastify";

const TimeTrackingPage = () => {
    const [trackings, setTrackings] = useState([]);
    const [activeTrackings, setActiveTrackings] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch all trackings (User sees their own, Admin sees all)
    const loadTrackings = useCallback(async () => {
        setLoading(true);
        try {
            const [trackingsResponse, activeResponse] = await Promise.all([
                fetchTimeTrackings(),
                fetchAllActiveTrackings(),
            ]);

            setTrackings(trackingsResponse.data);
            setActiveTrackings(activeResponse.data);
        } catch (error) {
            toast.error("Failed to fetch time trackings.");
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ Corrected useEffect (Now using useCallback for function dependency)
    useEffect(() => {
        loadTrackings();
    }, [loadTrackings]);

    return (
        <div style={styles.container}>
            <h2>Time Trackings</h2>

            {/* ✅ Active/Ongoing Trackings */}
            {activeTrackings.length > 0 && (
                <div style={styles.activeContainer}>
                    <h3>⏳ Ongoing Trackings</h3>
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Start Time</th>
                            <th>Note</th>
                        </tr>
                        </thead>
                        <tbody>
                        {activeTrackings.map((tracking) => (
                            <tr key={tracking.id}>
                                <td>{tracking.username}</td>
                                <td>{new Date(tracking.start_time).toLocaleString()}</td>
                                <td>{tracking.note}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ✅ All Past Time Trackings */}
            <h3>Completed Time Trackings</h3>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Customer</th>
                        <th>Project</th>
                        <th>Task</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Hours</th>
                        <th>Minutes</th>
                        <th>Note</th>
                    </tr>
                    </thead>
                    <tbody>
                    {trackings.map((tracking) => (
                        <tr key={tracking.id}>
                            <td>{tracking.username}</td>
                            <td>{tracking.customer_name}</td>
                            <td>{tracking.project_name}</td>
                            <td>{tracking.task_name}</td>
                            <td>{new Date(tracking.start_time).toLocaleString()}</td>
                            <td>{new Date(tracking.end_time).toLocaleString()}</td>
                            <td>{tracking.duration_hours}</td>
                            <td>{tracking.duration_minutes}</td>
                            <td>{tracking.note}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

// ✅ Styles
const styles = {
    container: { textAlign: "center", padding: "20px", maxWidth: "900px", margin: "auto" },
    activeContainer: { marginBottom: "20px", padding: "10px", backgroundColor: "#fff3cd", borderRadius: "8px" },
    table: { width: "100%", borderCollapse: "collapse", marginTop: "20px", backgroundColor: "#f9f9f9" },
    th: { backgroundColor: "#007bff", color: "white", padding: "12px", textAlign: "left", fontWeight: "bold" },
    td: { padding: "10px", borderBottom: "1px solid #ddd", textAlign: "left" },
    tableRowHover: { transition: "0.3s", cursor: "pointer" },
};

export default TimeTrackingPage;
