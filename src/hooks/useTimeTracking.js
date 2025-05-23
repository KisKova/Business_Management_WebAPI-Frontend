// useTimeTrackingPage.js
import { useEffect, useState, useCallback } from "react";
import {
    fetchTimeTracking,
    fetchAllActiveTracking,
    getAssignedCustomers,
    addManualTracking,
    updateTracking,
    deleteTracking,
} from "../services/timeTrackingService";
import { fetchAllTasks } from "../services/taskService";
import { fetchAllProjects } from "../services/projectService";
import { fetchAllCustomers } from "../services/customerService";
import { toast } from "react-toastify";

export const useTimeTrackingPage = () => {
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

    const userData = JSON.parse(localStorage.getItem("userData"));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTrackings = trackings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(trackings.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const loadTrackings = useCallback(async () => {
        setLoading(true);
        try {
            const commonPromises = [
                fetchTimeTracking(),
                fetchAllActiveTracking(),
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

            setTrackings(trackingsResponse.data.data);
            setActiveTrackings(activeResponse.data.data);
            setProjects(projectsResponse.data.data);
            setTasks(tasksResponse.data.data);

            if (user.role === "admin") {
                setAllCustomer(allCustomerResponse.data.data);
                setCustomers(customerResponse.data.data);
            } else {
                setCustomers(customerResponse.data.data);
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

    const handleTrackingUpdate = async (e, updatedData) => {
        e.preventDefault();
        try {
            const updatedTracking = {
                ...updatedData,
                start_time: new Date(updatedData.start_time).toISOString(),
            };
            await updateTracking(updatedData.id, updatedTracking);
            toast.success("Tracking updated!");
            setEditTracking(null);
            loadTrackings();
        } catch (error) {
            toast.error("Failed to update tracking.");
        }
    };

    return {
        userData,
        trackings,
        activeTrackings,
        loading,
        modalOpen,
        setModalOpen,
        editTracking,
        setEditTracking,
        projects,
        tasks,
        customers,
        allCustomer,
        manualTracking,
        setManualTracking,
        currentPage,
        totalPages,
        currentTrackings,
        handlePageChange,
        handleManualTrackingSubmit,
        handleDeleteTracking,
        handleTrackingUpdate
    };
};
