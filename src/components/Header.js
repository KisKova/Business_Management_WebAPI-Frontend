import React from "react";
import { Link } from "react-router-dom";
import logo from "../ppcmedia-logo-feher.png";
import Modal from "react-modal";
import { Menu, X, PlayCircle, StopCircle, Timer } from "lucide-react";
import { useHeaderTracking } from "../hooks/useHeader";
import "../App.css";

Modal.setAppElement("#root");

const Header = () => {
    const {
        userData,
        tracking,
        elapsedTime,
        modalType,
        note,
        selectedCustomer,
        selectedProject,
        selectedTask,
        assignedCustomers,
        projects,
        tasks,
        menuOpen,
        toggleMenu,
        setModalType,
        setNote,
        setSelectedCustomer,
        setSelectedProject,
        setSelectedTask,
        handleStartTracking,
        handleStopTracking,
        openStopModal,
        logout,
        formatElapsedTime
    } = useHeaderTracking();

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="PPC API Logo" />

                {userData && (
                    !tracking ? (
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
                    )
                )}

                <button className="menu-toggle" onClick={toggleMenu}>
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <div className="navbar-options">
                {userData && (
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                          d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                                    <path fillRule="evenodd"
                                          d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                                </svg>
                            </button>
                        </li>
                    </ul>
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
                    />
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
                        {assignedCustomers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    <label>Project:</label>
                    <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                        <option value="">Select Project</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>

                    <label>Task:</label>
                    <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
                        <option value="">Select Task</option>
                        {tasks.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
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
