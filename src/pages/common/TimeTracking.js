import { useTimeTrackingPage } from "../../hooks/useTimeTracking";
import Modal from "react-modal";
import "../../App.css";

Modal.setAppElement("#root");

const TimeTrackingPage = () => {
    const {
        userData,
        activeTrackings,
        currentTrackings,
        loading,
        modalOpen,
        setModalOpen,
        editTracking,
        setEditTracking,
        manualTracking,
        setManualTracking,
        projects,
        tasks,
        customers,
        allCustomer,
        currentPage,
        totalPages,
        handlePageChange,
        handleManualTrackingSubmit,
        handleDeleteTracking,
        handleTrackingUpdate
    } = useTimeTrackingPage();

    return (
        <div className="admin-container">
            <h2>Time Trackings</h2>
            <button className="create-user-button" onClick={() => setModalOpen(true)}>+ Add Manual Tracking</button>

            {/* Ongoing Trackings */}
            {activeTrackings.length > 0 && (
                <div style={{ backgroundColor: "#fff3cd", padding: "10px", borderRadius: "8px", boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)", marginTop: "20px" }}>
                    <h3>Ongoing Trackings</h3>
                    <table className="admin-table">
                        <thead className="admin-thead">
                        <tr>
                            {userData?.role === "admin" && <th>Username</th>}
                            <th>Start Time</th>
                            <th>Note</th>
                        </tr>
                        </thead>
                        <tbody>
                        {activeTrackings.map((tracking) => (
                            <tr key={tracking.id}>
                                {userData?.role === "admin" && <td style={{ fontWeight: "bold" }}>{tracking.username}</td>}
                                <td>{new Date(tracking.start_time).toLocaleString()}</td>
                                <td>{tracking.note}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Completed Trackings */}
            <h3>Completed Time Trackings</h3>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="admin-table">
                    <thead className="admin-thead">
                    <tr>
                        {userData?.role === "admin" && <th>Username</th>}
                        <th>Customer</th>
                        <th>Project</th>
                        <th>Task</th>
                        <th>Start Time</th>
                        <th>Billing Type</th>
                        <th>Duration</th>
                        <th>Note</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentTrackings.map((tracking) => (
                        <tr key={tracking.id} className="admin-trow">
                            {userData?.role === "admin" && <td style={{ fontWeight: "bold" }}>{tracking.username}</td>}
                            <td>{tracking.customer_name}</td>
                            <td>{tracking.project_name}</td>
                            <td>{tracking.task_name}</td>
                            <td>{new Date(tracking.start_time).toLocaleString()}</td>
                            <td>{tracking.billing_type}</td>
                            <td>
                                {tracking.duration_hours > 0
                                    ? `${tracking.duration_hours} hours ${tracking.duration_minutes} minutes`
                                    : `${tracking.duration_minutes} minutes`}
                            </td>
                            <td>{tracking.note}</td>
                            <td>
                                <button onClick={() => setEditTracking(tracking)} className="edit-button">Edit</button>
                                <button onClick={() => handleDeleteTracking(tracking.id)} className="delete-button">Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            <div className="pagination-container">
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        className={`pagination-button ${currentPage === i + 1 ? "active" : ""}`}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>

            {/* Add Modal */}
            <Modal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h3>Add Manual Time Tracking</h3>
                <form onSubmit={handleManualTrackingSubmit} className="admin-form">
                    <label>Start Date & Time:</label>
                    <input
                        type="datetime-local"
                        value={manualTracking.start_time}
                        className="admin-input"
                        onChange={(e) => setManualTracking({ ...manualTracking, start_time: e.target.value })}
                        required
                    />
                    <label>Duration (Hours):</label>
                    <input
                        type="number"
                        value={manualTracking.duration_hours}
                        className="admin-input"
                        onChange={(e) => setManualTracking({ ...manualTracking, duration_hours: e.target.value })}
                    />
                    <label>Duration (Minutes):</label>
                    <input
                        type="number"
                        value={manualTracking.duration_minutes}
                        className="admin-input"
                        onChange={(e) => setManualTracking({ ...manualTracking, duration_minutes: e.target.value })}
                        required
                    />
                    <label>Customer:</label>
                    <select
                        value={manualTracking.customer_id}
                        className="admin-input"
                        onChange={(e) => setManualTracking({ ...manualTracking, customer_id: e.target.value })}
                        required
                    >
                        <option value="">Select Customer</option>
                        {customers.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <label>Project:</label>
                    <select
                        value={manualTracking.project_id}
                        className="admin-input"
                        onChange={(e) => setManualTracking({ ...manualTracking, project_id: e.target.value })}
                        required
                    >
                        <option value="">Select Project</option>
                        {projects.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <label>Task:</label>
                    <select
                        value={manualTracking.task_id}
                        className="admin-input"
                        onChange={(e) => setManualTracking({ ...manualTracking, task_id: e.target.value })}
                        required
                    >
                        <option value="">Select Task</option>
                        {tasks.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                    <label>Note:</label>
                    <textarea
                        value={manualTracking.note}
                        className="admin-input"
                        onChange={(e) => setManualTracking({ ...manualTracking, note: e.target.value })}
                    />
                    <button type="submit" className="submit-button">Add Tracking</button>
                    <button type="button" onClick={() => setModalOpen(false)} className="delete-button">Cancel</button>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={!!editTracking}
                onRequestClose={() => setEditTracking(null)}
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h3>Edit Time Tracking</h3>
                {editTracking && (
                    <form onSubmit={(e) => handleTrackingUpdate(e, editTracking)} className="admin-form">
                        <label>Start Date & Time:</label>
                        <input
                            type="datetime-local"
                            value={editTracking.start_time?.slice(0, 16)}
                            className="admin-input"
                            onChange={(e) =>
                                setEditTracking({ ...editTracking, start_time: e.target.value })
                            }
                            required
                        />
                        <label>Duration (Hours):</label>
                        <input
                            type="number"
                            className="admin-input"
                            value={editTracking.duration_hours}
                            onChange={(e) =>
                                setEditTracking({ ...editTracking, duration_hours: e.target.value })
                            }
                            required
                        />
                        <label>Duration (Minutes):</label>
                        <input
                            type="number"
                            className="admin-input"
                            value={editTracking.duration_minutes}
                            onChange={(e) =>
                                setEditTracking({ ...editTracking, duration_minutes: e.target.value })
                            }
                            required
                        />
                        <label>Customer:</label>
                        <select
                            className="admin-input"
                            value={editTracking.customer_id}
                            onChange={(e) =>
                                setEditTracking({ ...editTracking, customer_id: e.target.value })
                            }
                            required
                        >
                            <option value="">Select Customer</option>
                            {(userData?.role === "admin" ? allCustomer : customers).map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <label>Project:</label>
                        <select
                            className="admin-input"
                            value={editTracking.project_id}
                            onChange={(e) =>
                                setEditTracking({ ...editTracking, project_id: e.target.value })
                            }
                            required
                        >
                            <option value="">Select Project</option>
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <label>Task:</label>
                        <select
                            className="admin-input"
                            value={editTracking.task_id}
                            onChange={(e) =>
                                setEditTracking({ ...editTracking, task_id: e.target.value })
                            }
                            required
                        >
                            <option value="">Select Task</option>
                            {tasks.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <label>Note:</label>
                        <textarea
                            className="admin-input"
                            value={editTracking.note}
                            onChange={(e) =>
                                setEditTracking({ ...editTracking, note: e.target.value })
                            }
                        />
                        <button type="submit" className="submit-button">Save Changes</button>
                        <button type="button" onClick={() => setEditTracking(null)} className="delete-button">Cancel</button>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default TimeTrackingPage;
