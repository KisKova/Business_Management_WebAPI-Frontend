import Modal from "react-modal";
import "../../App.css";
import {usePagination} from "../../hooks/usePagination";
import {useTasks} from "../../hooks/useTasks";

Modal.setAppElement("#root");

const AdminTasks = () => {
    const {
        tasks,
        modalType,
        taskName,
        setTaskName,
        openModal,
        closeModal,
        handleCreateTask,
        handleUpdateTask,
        handleDeleteTask
    } = useTasks();

    const {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems: paginatedTasks,
        nextPage,
        prevPage,
    } = usePagination(tasks, 10);

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

            <div className="pagination-container">
                <button className="pagination-button" onClick={prevPage} disabled={currentPage === 1}>
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

                <button className="pagination-button" onClick={nextPage} disabled={currentPage === totalPages}>
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
