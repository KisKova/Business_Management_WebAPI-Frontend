import { useEffect, useState } from "react";
import { fetchAllTasks, createTask, updateTask, deleteTask } from "../services/api";
import { toast } from "react-toastify";
import Modal from "react-modal";

Modal.setAppElement("#root");

const AdminTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskName, setTaskName] = useState("");

    useEffect(() => {
        loadTasks();
    }, []);

    // ✅ Load all tasks
    const loadTasks = async () => {
        try {
            const response = await fetchAllTasks();
            setTasks(response.data);
        } catch (error) {
            toast.error("Failed to load tasks.");
        }
    };

    // ✅ Handle opening modals
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

    // ✅ Handle task creation
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

    // ✅ Handle task update
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

    // ✅ Handle task deletion
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
        <div style={styles.container}>
            <h2>Task Management</h2>
            <button onClick={() => openModal("create")} style={styles.createButton}>+ Create Task</button>

            {/* Tasks Table */}
            <table style={styles.table}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map((task) => (
                    <tr key={task.id}>
                        <td>{task.id}</td>
                        <td>{task.name}</td>
                        <td>
                            <button onClick={() => openModal("edit", task)} style={styles.buttonEdit}>Edit</button>
                            <button onClick={() => handleDeleteTask(task.id)} style={styles.buttonDelete}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Create/Edit Task Modal */}
            <Modal isOpen={modalType === "create" || modalType === "edit"} onRequestClose={closeModal} style={styles.modal}>
                <h3>{modalType === "create" ? "Create New Task" : "Edit Task"}</h3>
                <form onSubmit={modalType === "create" ? handleCreateTask : handleUpdateTask} style={styles.form}>
                    <label>Task Name:</label>
                    <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} required />

                    <button type="submit">{modalType === "create" ? "Create" : "Save"}</button>
                    <button type="button" onClick={closeModal}>Cancel</button>
                </form>
            </Modal>
        </div>
    );
};

// ✅ Styles
const styles = {
    container: { textAlign: "center", padding: "20px", maxWidth: "800px", margin: "auto" },
    createButton: { padding: "10px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "20px", fontSize: "16px" },
    table: { width: "100%", borderCollapse: "collapse", marginTop: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px", overflow: "hidden", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" },
    buttonEdit: { padding: "5px 10px", backgroundColor: "#ffc107", color: "black", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "14px", marginRight: "5px" },
    buttonDelete: { padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "14px" },
    modal: { content: { width: "400px", margin: "auto", padding: "20px", textAlign: "center", borderRadius: "10px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" } },
    form: { display: "flex", flexDirection: "column", gap: "10px" }
};

export default AdminTasks;
