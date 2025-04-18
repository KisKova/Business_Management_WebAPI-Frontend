import { useState, useEffect } from "react";
import {
    fetchAllTasks,
    createTask,
    updateTask,
    deleteTask
} from "../services/taskService";
import { toast } from "react-toastify";

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskName, setTaskName] = useState("");

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const res = await fetchAllTasks();
            setTasks(res.data.data);
        } catch (err) {
            toast.error("Failed to load tasks.");
        }
    };

    const openModal = (type, task = null) => {
        setModalType(type);
        setSelectedTask(task);
        setTaskName(task ? task.name : "");
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedTask(null);
        setTaskName("");
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await createTask(taskName);
            toast.success("Task created successfully!");
            closeModal();
            loadTasks();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error creating task.");
        }
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            await updateTask(selectedTask.id, taskName);
            toast.success("Task updated successfully!");
            closeModal();
            loadTasks();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error updating task.");
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId);
            toast.success("Task deleted successfully!");
            loadTasks();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error deleting task.");
        }
    };

    return {
        tasks,
        modalType,
        taskName,
        setTaskName,
        openModal,
        closeModal,
        handleCreateTask,
        handleUpdateTask,
        handleDeleteTask
    };
};
