import { useEffect, useState } from "react";
import { fetchAllProjects, createProject, updateProject, deleteProject } from "../services/api";
import { toast } from "react-toastify";
import Modal from "react-modal";

Modal.setAppElement("#root");

const AdminProjects = () => {
    const [projects, setProjects] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectName, setProjectName] = useState("");

    useEffect(() => {
        loadProjects();
    }, []);

    // ✅ Load all projects
    const loadProjects = async () => {
        try {
            const response = await fetchAllProjects();
            setProjects(response.data);
        } catch (error) {
            toast.error("Failed to load projects.");
        }
    };

    // ✅ Handle opening modals
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

    // ✅ Handle project creation
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

    // ✅ Handle project update
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

    // ✅ Handle project deletion
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
        <div style={styles.container}>
            <h2>Project Management</h2>
            <button onClick={() => openModal("create")} style={styles.createButton}>+ Create Project</button>

            {/* Projects Table */}
            <table style={styles.table}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {projects.map((project) => (
                    <tr key={project.id}>
                        <td>{project.id}</td>
                        <td>{project.name}</td>
                        <td>
                            <button onClick={() => openModal("edit", project)} style={styles.buttonEdit}>Edit</button>
                            <button onClick={() => handleDeleteProject(project.id)} style={styles.buttonDelete}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Create/Edit Project Modal */}
            <Modal isOpen={modalType === "create" || modalType === "edit"} onRequestClose={closeModal} style={styles.modal}>
                <h3>{modalType === "create" ? "Create New Project" : "Edit Project"}</h3>
                <form onSubmit={modalType === "create" ? handleCreateProject : handleUpdateProject} style={styles.form}>
                    <label>Project Name:</label>
                    <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />

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

export default AdminProjects;
