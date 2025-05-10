import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import logo from "../ppcmedia-logo-feher.png";
import { startTracking, getActiveTracking, getAssignedCustomers, stopTracking } from "../services/timeTrackingService";
import { fetchAllProjects } from "../services/projectService";
import { fetchAllTasks } from "../services/taskService";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { Menu, X, PlayCircle, StopCircle, Timer } from "lucide-react";

Modal.setAppElement("#root");

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [userData, setUserData] = useState(() => {
        const storedUser = localStorage.getItem("userData");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [tracking, setTracking] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [modalType, setModalType] = useState(null);
    const [note, setNote] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedTask, setSelectedTask] = useState("");
    const [assignedCustomers, setAssignedCustomers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    // inside Header component
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen((prev) => !prev);

    const loadActiveTracking = useCallback(async () => {
        try {
            const response = await getActiveTracking();
            if (response.data.data && response.data.data.id) {
                setTracking(response.data.data);
                updateElapsedTime(response.data.data.start_time);
            } else {
                setTracking(null);
            }
        } catch (error) {
            console.error("Error fetching active tracking:", error);
        }
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        setUserData(storedUser ? JSON.parse(storedUser) : null);

        if (storedUser) {
            loadActiveTracking();
        }
    }, [location, loadActiveTracking]);

    useEffect(() => {
        if (tracking) {
            const interval = setInterval(() => {
                updateElapsedTime(tracking.start_time);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [tracking]);

    const updateElapsedTime = (startTime) => {
        console.log("Update Elapsed Time - startTime:", startTime);
        const diff = Math.floor((new Date() - new Date(startTime)) / 1000);
        setElapsedTime(diff);
    };

    const handleStartTracking = async (e) => {
        e.preventDefault();
        try {
            const response = await startTracking(note);
            setTracking(response.data.data);
            updateElapsedTime(response.data.data.start_time);
            setModalType(null);
            setNote("");
            toast.success("Time tracking started!");
        } catch (error) {
            if (error.response) {
                console.error("Server responded with:", error.response.status, error.response.data);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error setting up request:", error.message);
            }
            toast.error("Error starting time tracking.");
        }

    };

    const openStopModal = async () => {
        try {
            const [customersResponse, projectsResponse, tasksResponse] = await Promise.all([
                getAssignedCustomers(),
                fetchAllProjects(),
                fetchAllTasks(),
            ]);
            setAssignedCustomers(customersResponse.data.data);
            setProjects(projectsResponse.data.data);
            setTasks(tasksResponse.data.data);
            setModalType("stopTracking");
        } catch (error) {
            toast.error("Error fetching tracking data.");
        }
    };

    const handleStopTracking = async (e) => {
        e.preventDefault();
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

    const formatElapsedTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

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
                <img
                    src={logo}
                    alt="PPC API Logo"
                />
                {userData ? (
                    <>
                    {!tracking ? (
                        <li>
                            <button onClick={() => setModalType("startTracking")} className="icon-button" title="Start Tracking">
                                <PlayCircle size={28} />
                            </button>
                        </li>
                    ) : (
                        <li className="navbar-time-tracking">
                                        <span className="tracking-icon">
                                          <Timer size={20} style={{ marginRight: "6px" }} />
                                            {formatElapsedTime(elapsedTime)}
                                        </span>
                            <button onClick={openStopModal} className="icon-button" title="Stop Tracking">
                                <StopCircle size={28} />
                            </button>
                        </li>

                    )}
                    </>
                ):(<></>)}

                {/* Hamburger button */}
                <button className="menu-toggle" onClick={toggleMenu}>
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
            <div className="navbar-options">
                    {userData ? (
                        <>
                        <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
                            <li><Link to="/time-tracking">Time Tracking</Link></li>
                            <li><Link to="/reports">Reports</Link></li>

                            {userData.role === "admin" && (
                                <>
                                    <li><Link to="/tasks">Tasks</Link></li>
                                    <li><Link to="/projects">Projects</Link></li>
                                    <li><Link to="/customers">Customers</Link></li>
                                    <li><Link to="/admin-dashboard">Admin Panel</Link></li>
                                    <li><Link to="/customer-summary">Customer Summary</Link></li>
                                </>
                            )}
                            <li className="navbar-profile-container">
                                <Link to="/profile">
                                    <span className="username">{userData.username}</span>
                                </Link>
                            </li>
                            <li className="navbar-profile-container">
                                <button className="logout-button" onClick={logout}>
                                    Logout
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                                        <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                                    </svg>
                                </button>
                            </li>
                        </ul>
                        </>
                    ) : (
                        <></>
                    )}
            </div>

            {/* Start Tracking Modal */}
            <Modal
                isOpen={modalType === "startTracking"}
                onRequestClose={() => setModalType(null)}
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h3>Start Time Tracking</h3>

                <form className="admin-form">
                    <textarea
                        placeholder="What are you working on?"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                    <button onClick={handleStartTracking} className="start-button">Start</button>
                    <button onClick={() => setModalType(null)} className="cancel-button">Cancel</button>
                </form>
            </Modal>

            {/* Stop Tracking Modal */}
            <Modal
                isOpen={modalType === "stopTracking"}
                onRequestClose={() => setModalType(null)}
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h3>Stop Time Tracking</h3>

                <form className="admin-form">
                    <label>Customer:</label>
                    <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
                        <option value="">Select Customer</option>
                        {assignedCustomers.map((customer) => (
                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                        ))}
                    </select>

                    <label>Project:</label>
                    <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                        <option value="">Select Project</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>

                    <label>Task:</label>
                    <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
                        <option value="">Select Task</option>
                        {tasks.map((task) => (
                            <option key={task.id} value={task.id}>{task.name}</option>
                        ))}
                    </select>

                    <button onClick={handleStopTracking} className="stop-button">Stop</button>
                    <button onClick={() => setModalType(null)} className="cancel-button">Cancel</button>
                </form>
            </Modal>
        </nav>
    );
};

export default Header;
