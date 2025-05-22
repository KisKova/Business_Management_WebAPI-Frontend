import { useState, useEffect, useCallback } from "react";
import {
    startTracking,
    getActiveTracking,
    getAssignedCustomers,
    stopTracking
} from "../services/timeTrackingService";
import { fetchAllProjects } from "../services/projectService";
import { fetchAllTasks } from "../services/taskService";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export const useHeaderTracking = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [userData, setUserData] = useState(() => {
        const stored = localStorage.getItem("userData");
        return stored ? JSON.parse(stored) : null;
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
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    const updateElapsedTime = (startTime) => {
        const diff = Math.floor((new Date() - new Date(startTime)) / 1000);
        setElapsedTime(diff);
    };

    const loadActiveTracking = useCallback(async () => {
        try {
            const res = await getActiveTracking();
            if (res.data.data?.id) {
                setTracking(res.data.data);
                updateElapsedTime(res.data.data.start_time);
            } else {
                setTracking(null);
            }
        } catch {
            console.error("Failed to load active tracking.");
        }
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("userData");
        setUserData(stored ? JSON.parse(stored) : null);
        if (stored) loadActiveTracking();
    }, [location, loadActiveTracking]);

    useEffect(() => {
        if (tracking) {
            const interval = setInterval(() => {
                updateElapsedTime(tracking.start_time);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [tracking]);

    const handleStartTracking = async (e) => {
        e.preventDefault();
        try {
            const res = await startTracking(note);
            setTracking(res.data.data);
            updateElapsedTime(res.data.data.start_time);
            setNote("");
            setModalType(null);
            toast.success("Time tracking started!");
        } catch {
            toast.error("Error starting time tracking.");
        }
    };

    const openStopModal = async () => {
        try {
            const [c, p, t] = await Promise.all([
                getAssignedCustomers(),
                fetchAllProjects(),
                fetchAllTasks()
            ]);
            setAssignedCustomers(c.data.data);
            setProjects(p.data.data);
            setTasks(t.data.data);
            setModalType("stopTracking");
        } catch {
            toast.error("Error fetching tracking data.");
        }
    };

    const handleStopTracking = async (e) => {
        e.preventDefault();
        if (!selectedCustomer || !selectedProject || !selectedTask) {
            toast.error("Please select a project, task, and customer.");
            return;
        }
        try {
            await stopTracking(tracking.id, selectedProject, selectedTask, selectedCustomer);
            setTracking(null);
            setElapsedTime(0);
            setModalType(null);
            toast.success("Time tracking stopped!");
        } catch {
            toast.error("Error stopping time tracking.");
        }
    };

    const logout = () => {
        setUserData(null);
        setTracking(null);
        setElapsedTime(0);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        navigate("/login");
    };

    const formatElapsedTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    return {
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
        formatElapsedTime,
    };
};
