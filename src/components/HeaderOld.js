import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import {
    startTracking,
    getActiveTracking,
    getAssignedCustomers,
    fetchAllProjects,
    fetchAllTasks,
    stopTracking
} from "../services/api";
import Modal from "react-modal";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // ✅ Load user data from localStorage on mount
    const [userData, setUserData] = useState(() => {
        const storedUser = localStorage.getItem("userData");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // ✅ Time tracking state
    const [tracking, setTracking] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [modalType, setModalType] = useState(null);
    const [note, setNote] = useState("");

    // ✅ Stop tracking selections
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedTask, setSelectedTask] = useState("");
    const [assignedCustomers, setAssignedCustomers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);

    // ✅ Load active tracking from API on mount & login
    const loadActiveTracking = useCallback(async () => {
        try {
            const response = await getActiveTracking();
            if (response.data && response.data.id) {
                setTracking(response.data);
                updateElapsedTime(response.data.start_time);
            } else {
                setTracking(null);
            }
        } catch (error) {
            console.error("Error fetching active tracking:", error);
        }
    }, []);

    // ✅ Update user data & active tracking on login/logout or page reload
    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        setUserData(storedUser ? JSON.parse(storedUser) : null);

        if (storedUser) {
            loadActiveTracking(); // Ensure tracking loads correctly
        }
    }, [location, loadActiveTracking]);

    // ✅ Update elapsed time every second when tracking is active
    useEffect(() => {
        if (tracking) {
            const interval = setInterval(() => {
                updateElapsedTime(tracking.start_time);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [tracking]);

    // ✅ Calculate elapsed time from start_time
    const updateElapsedTime = (startTime) => {
        const diff = Math.floor((new Date() - new Date(startTime)) / 1000);
        setElapsedTime(diff);
    };

    // ✅ Handle starting a time tracking session
    const handleStartTracking = async () => {
        try {
            const response = await startTracking(note);
            setTracking(response.data);
            updateElapsedTime(response.data.start_time);
            setModalType(null);
            setNote("");
            toast.success("Time tracking started!");
        } catch (error) {
            toast.error("Error starting time tracking.");
        }
    };

    // ✅ Open Stop Tracking Modal and Fetch Data
    const openStopModal = async () => {
        try {
            const [customersResponse, projectsResponse, tasksResponse] = await Promise.all([
                getAssignedCustomers(),
                fetchAllProjects(),
                fetchAllTasks(),
            ]);
            setAssignedCustomers(customersResponse.data);
            setProjects(projectsResponse.data);
            setTasks(tasksResponse.data);
            setModalType("stopTracking");
        } catch (error) {
            toast.error("Error fetching tracking data.");
        }
    };

    // ✅ Stop Time Tracking
    const handleStopTracking = async () => {
        if (!selectedProject || !selectedTask || !selectedCustomer) {
            toast.error("Please select a project, task, and customer.");
            return;
        }
        try {
            await stopTracking(tracking.id, selectedProject, selectedTask, selectedCustomer);
            setTracking(null);
            setElapsedTime(0);
            setModalType(null);
            toast.success("Time tracking stopped!");
        } catch (error) {
            toast.error("Error stopping time tracking.");
        }
    };

    // ✅ Convert elapsed time to HH:MM:SS format
    const formatElapsedTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    // ✅ Logout function
    const logout = () => {
        setUserData(null);
        setTracking(null);
        setElapsedTime(0);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <span className="logo-text">PPC API</span>
            </div>
            <ul className="navbar-links">
                {userData ? (
                    <>
                        <li><Link to="/time-tracking">Time Tracking</Link></li>
                        {userData.role === "admin" && (
                            <>
                                <li><Link to="/tasks">Tasks</Link></li>
                                <li><Link to="/projects">Projects</Link></li>
                                <li><Link to="/customers">Customers</Link></li>
                                <li><Link to="/admin-dashboard">Admin Panel</Link></li>
                            </>
                        )}

                        {/* ✅ Time Tracking Section */}
                        {!tracking && (
                            <li>
                                <button onClick={() => setModalType("startTracking")} className="start-button">Start Tracking</button>
                            </li>
                        )}
                        {tracking && (
                            <li className="navbar-time-tracking">
                                <span>⏳ {formatElapsedTime(elapsedTime)}</span>
                                <button onClick={openStopModal} className="stop-button">Stop</button>
                            </li>
                        )}

                        <li className="navbar-profile-container">
                            <Link to="/profile">
                                <span className="username">{userData.username}</span>
                            </Link>
                        </li>
                        <li className="navbar-profile-container">
                            <button className="logout-button" onClick={logout}>Logout</button>
                        </li>
                    </>
                ) : (
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                )}
            </ul>

            {/* ✅ Start Tracking Modal */}
            <Modal isOpen={modalType === "startTracking"} onRequestClose={() => setModalType(null)}>
                <h3>Start Time Tracking</h3>
                <textarea placeholder="What are you working on?" value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                <button onClick={handleStartTracking} className="start-button">Start</button>
                <button onClick={() => setModalType(null)}>Cancel</button>
            </Modal>

            {/* ✅ Stop Tracking Modal */}
            <Modal isOpen={modalType === "stopTracking"} onRequestClose={() => setModalType(null)}>
                <h3>Stop Time Tracking</h3>
                <label>Customer:</label>
                <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
                    <option value="">Select Customer</option>
                    {assignedCustomers.map(customer => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
                </select>

                <label>Project:</label>
                <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                    <option value="">Select Project</option>
                    {projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
                </select>

                <label>Task:</label>
                <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
                    <option value="">Select Task</option>
                    {tasks.map(task => <option key={task.id} value={task.id}>{task.name}</option>)}
                </select>

                <button onClick={handleStopTracking} className="stop-button">Stop</button>
                <button onClick={() => setModalType(null)}>Cancel</button>
            </Modal>
        </nav>
    );
};

export default Header;
