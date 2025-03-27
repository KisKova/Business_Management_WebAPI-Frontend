import { useEffect, useState, useCallback } from "react";
import {
    fetchTimeTrackings,
    fetchAllActiveTrackings,
    fetchAllProjects,
    fetchAllTasks,
    getAssignedCustomers,
    addManualTracking,
    updateTracking,
    fetchAllCustomers,
    deleteTracking,
} from "../services/api";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "../App.css";

Modal.setAppElement("#root");

const TimeTrackingPage = () => {
    const [trackings, setTrackings] = useState([]);
    const [activeTrackings, setActiveTrackings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTracking, setEditTracking] = useState(null);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [allCustomer, setAllCustomer] = useState([]);
    const [manualTracking, setManualTracking] = useState({
        start_time: "",
        duration_hours: "",
        duration_minutes: "",
        project_id: "",
        task_id: "",
        customer_id: "",
        note: ""
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTrackings = trackings.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(trackings.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };



    const userData = JSON.parse(localStorage.getItem("userData"));

    const loadTrackings = useCallback(async () => {
        setLoading(true);
        try {
            const commonPromises = [
                fetchTimeTrackings(),
                fetchAllActiveTrackings(),
                fetchAllProjects(),
                fetchAllTasks(),
                getAssignedCustomers()
            ];

            const user = JSON.parse(localStorage.getItem("userData"));

            const allCustomerPromise = user.role === "admin"
                ? fetchAllCustomers()
                : getAssignedCustomers();

            const [
                trackingsResponse,
                activeResponse,
                projectsResponse,
                tasksResponse,
                customerResponse,
                allCustomerResponse
            ] = await Promise.all([...commonPromises, allCustomerPromise]);

            setTrackings(trackingsResponse.data);
            setActiveTrackings(activeResponse.data);
            setProjects(projectsResponse.data);
            setTasks(tasksResponse.data);

            if (user.role === "admin") {
                setAllCustomer(allCustomerResponse.data);
                setCustomers(customerResponse.data);
            } else {
                setCustomers(customerResponse.data);
                setAllCustomer([]);
            }
        } catch (error) {
            toast.error("Failed to fetch time trackings.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTrackings();
    }, [loadTrackings]);

    const handleManualTrackingSubmit = async (e) => {
        e.preventDefault();
        try {
            await addManualTracking(manualTracking);
            toast.success("Time tracking added successfully!");
            setModalOpen(false);
            loadTrackings();
        } catch (error) {
            toast.error("Failed to add time tracking.");
        }
    };

    const handleDeleteTracking = async (id) => {
        if (!window.confirm("Are you sure you want to delete this time tracking entry?")) return;

        try {
            await deleteTracking(id);
            toast.success("Tracking entry deleted.");
            loadTrackings();
        } catch (error) {
            toast.error("Failed to delete tracking.");
        }
    };

    return (
        <div className="admin-container">
            <h2>Time Trackings</h2>
            <button className="create-user-button" onClick={() => setModalOpen(true)}>+ Add Manual Tracking</button>

            {/* Ongoing Trackings */}
            {activeTrackings.length > 0 && (
                <div className="admin-trow" style={{ backgroundColor: "#fff3cd", padding: "10px", borderRadius: "8px" }}>
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
                                {userData?.role === "admin" && <td>{tracking.username}</td>}
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
                        <th>End Time</th>
                        <th>Billing Type</th>
                        <th>Hours</th>
                        <th>Minutes</th>
                        <th>Note</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentTrackings.map((tracking) => (
                        <tr key={tracking.id} className="admin-trow">
                            {userData?.role === "admin" && <td>{tracking.username}</td>}
                            <td>{tracking.customer_name}</td>
                            <td>{tracking.project_name}</td>
                            <td>{tracking.task_name}</td>
                            <td>{new Date(tracking.start_time).toLocaleString()}</td>
                            <td>{new Date(tracking.end_time).toLocaleString()}</td>
                            <td>{tracking.billing_type}</td>
                            <td>{tracking.duration_hours}</td>
                            <td>{tracking.duration_minutes}</td>
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


            {/* Create Modal */}
            <Modal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h3>Add Manual Time Tracking</h3>
                <form onSubmit={handleManualTrackingSubmit} className="admin-form">
                    <label>Start Date & Time:</label>
                    <input type="datetime-local" value={manualTracking.start_time}
                           className="admin-input"
                           onChange={(e) => setManualTracking({...manualTracking, start_time: e.target.value})} required />

                    <label>Duration (Hours):</label>
                    <input type="number" value={manualTracking.duration_hours}
                           className="admin-input"
                           onChange={(e) => setManualTracking({...manualTracking, duration_hours: e.target.value})} />

                    <label>Duration (Minutes):</label>
                    <input type="number" value={manualTracking.duration_minutes}
                           className="admin-input"
                           onChange={(e) => setManualTracking({...manualTracking, duration_minutes: e.target.value})} required />

                    <label>Customer:</label>
                    <select value={manualTracking.customer_id}
                            className="admin-input"
                            onChange={(e) => setManualTracking({...manualTracking, customer_id: e.target.value})} required>
                        <option value="">Select Customer</option>
                        {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                        ))}
                    </select>

                    <label>Project:</label>
                    <select value={manualTracking.project_id}
                            className="admin-input"
                            onChange={(e) => setManualTracking({...manualTracking, project_id: e.target.value})} required>
                        <option value="">Select Project</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>

                    <label>Task:</label>
                    <select value={manualTracking.task_id}
                            className="admin-input"
                            onChange={(e) => setManualTracking({...manualTracking, task_id: e.target.value})} required>
                        <option value="">Select Task</option>
                        {tasks.map(task => (
                            <option key={task.id} value={task.id}>{task.name}</option>
                        ))}
                    </select>

                    <label>Note:</label>
                    <textarea value={manualTracking.note}
                              className="admin-input"
                              onChange={(e) => setManualTracking({...manualTracking, note: e.target.value})} />

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
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                const updatedTracking = {
                                    ...editTracking,
                                    start_time: new Date(editTracking.start_time).toISOString(),
                                };
                                await updateTracking(editTracking.id, updatedTracking);
                                toast.success("Tracking updated!");
                                setEditTracking(null);
                                loadTrackings();
                            } catch (error) {
                                toast.error("Failed to update tracking.");
                            }
                        }}
                        className="admin-form"
                    >
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
                            {(userData.role === "admin" ? allCustomer : customers).map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
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
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
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
                            {tasks.map((task) => (
                                <option key={task.id} value={task.id}>
                                    {task.name}
                                </option>
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
