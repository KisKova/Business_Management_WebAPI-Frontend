import Modal from "react-modal";
import "../../App.css";
import {useProjects} from "../../hooks/useProjects";
import {usePagination} from "../../hooks/usePagination";

Modal.setAppElement("#root");

const AdminProjects = () => {
    const {
        projects,
        modalType,
        projectName,
        setProjectName,
        openModal,
        closeModal,
        handleCreateProject,
        handleUpdateProject,
        handleDeleteProject,
    } = useProjects();

    const {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems: paginatedProjects,
        nextPage,
        prevPage,
    } = usePagination(projects, 10);

    return (
        <div className="admin-container">
            <h2>Project Management</h2>
            <button onClick={() => openModal("create")} className="create-user-button">+ Create Project</button>

            <table className="admin-table">
                <thead className="admin-thead">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {paginatedProjects.map((project) => (
                    <tr key={project.id} className="admin-trow">
                        <td>{project.id}</td>
                        <td>{project.name}</td>
                        <td>
                            <button onClick={() => openModal("edit", project)} className="edit-button">Edit</button>
                            <button onClick={() => handleDeleteProject(project.id)} className="delete-button">Delete</button>
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


            <Modal
                isOpen={modalType === "create" || modalType === "edit"}
                onRequestClose={closeModal}
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h3>{modalType === "create" ? "Create New Project" : "Edit Project"}</h3>
                <form onSubmit={modalType === "create" ? handleCreateProject : handleUpdateProject} className="admin-form">
                    <label>Project Name:</label>
                    <input
                        type="text"
                        value={projectName}
                        className="admin-input"
                        onChange={(e) => setProjectName(e.target.value)}
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

export default AdminProjects;
