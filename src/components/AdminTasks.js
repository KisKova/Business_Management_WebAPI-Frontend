import { useEffect, useState } from "react";
import { fetchAllTasks, createTask, updateTask, deleteTask } from "../services/api";
import { toast } from "react-toastify";
import Modal from "react-modal";
import "../App.css";

Modal.setAppElement("#root");

const AdminTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskName, setTaskName] = useState("");

    // ✅ Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 10;
    const totalPages = Math.ceil(tasks.length / tasksPerPage);
    const paginatedTasks = tasks.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const response = await fetchAllTasks();
            setTasks(response.data);
        } catch (error) {
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
        } catch (error) {
            toast.error("Error creating task.");
        }
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            await updateTask(selectedTask.id, taskName);
            toast.success("Task updated successfully!");
            closeModal();
            loadTasks();
        } catch (error) {
            toast.error("Error updating task.");
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId);
            toast.success("Task deleted successfully!");
            loadTasks();
        } catch (error) {
            toast.error("Error deleting task.");
        }
    };

    return (
        <div className="admin-container">
            <h2>Task Management</h2>
            <button onClick={() => openModal("create")} className="create-user-button">
                + Create Task
            </button>

            <table className="admin-table">
                <thead className="admin-thead">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {paginatedTasks.map((task) => (
                    <tr key={task.id} className="admin-trow">
                        <td>{task.id}</td>
                        <td>{task.name}</td>
                        <td>
                            <button onClick={() => openModal("edit", task)} className="edit-button">Edit</button>
                            <button onClick={() => handleDeleteTask(task.id)} className="delete-button">Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* ✅ Pagination */}
            <div className="pagination-container">
                <button
                    className="pagination-button"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        className={`pagination-button ${currentPage === i + 1 ? "active" : ""}`}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    className="pagination-button"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>

            {/* ✅ Create/Edit Modal */}
            <Modal
                isOpen={modalType === "create" || modalType === "edit"}
                onRequestClose={closeModal}
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h3>{modalType === "create" ? "Create New Task" : "Edit Task"}</h3>
                <form onSubmit={modalType === "create" ? handleCreateTask : handleUpdateTask} className="admin-form">
                    <label>Task Name:</label>
                    <input
                        type="text"
                        value={taskName}
                        className="admin-input"
                        onChange={(e) => setTaskName(e.target.value)}
                        required
                    />

                    <button type="submit" className="submit-button">
                        {modalType === "create" ? "Create" : "Save"}
                    </button>
                    <button type="button" onClick={closeModal} className="delete-button">Cancel</button>
                </form>
            </Modal>
        </div>
    );
};

export default AdminTasks;
