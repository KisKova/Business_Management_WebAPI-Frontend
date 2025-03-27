import { useEffect, useState } from "react";
import { fetchAllProjects, createProject, updateProject, deleteProject } from "../services/api";
import { toast } from "react-toastify";
import Modal from "react-modal";
import "../App.css";

Modal.setAppElement("#root");

const AdminProjects = () => {
    const [projects, setProjects] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectName, setProjectName] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 10;

    const totalPages = Math.ceil(projects.length / projectsPerPage);
    const paginatedProjects = projects.slice(
        (currentPage - 1) * projectsPerPage,
        currentPage * projectsPerPage
    );


    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const response = await fetchAllProjects();
            setProjects(response.data);
        } catch (error) {
            toast.error("Failed to load projects.");
        }
    };

    const openModal = (type, project = null) => {
        setModalType(type);
        setSelectedProject(project);
        setProjectName(project ? project.name : "");
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedProject(null);
        setProjectName("");
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await createProject(projectName);
            toast.success("Project created successfully!");
            closeModal();
            loadProjects();
        } catch (error) {
            toast.error("Error creating project.");
        }
    };

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        try {
            await updateProject(selectedProject.id, projectName);
            toast.success("Project updated successfully!");
            closeModal();
            loadProjects();
        } catch (error) {
            toast.error("Error updating project.");
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await deleteProject(projectId);
            toast.success("Project deleted successfully!");
            loadProjects();
        } catch (error) {
            toast.error("Error deleting project.");
        }
    };

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
