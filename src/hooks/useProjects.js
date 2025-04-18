import { useState, useEffect } from "react";
import {
    fetchAllProjects,
    createProject,
    updateProject,
    deleteProject,
} from "../services/projectService";
import { toast } from "react-toastify";

export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectName, setProjectName] = useState("");

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const response = await fetchAllProjects();
            setProjects(response.data.data);
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
            toast.error(error.response?.data?.message || "Error creating project.");
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
            toast.error(error.response?.data?.message || "Error updating project.");
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await deleteProject(projectId);
            toast.success("Project deleted successfully!");
            loadProjects();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting project.");
        }
    };

    return {
        projects,
        modalType,
        selectedProject,
        projectName,
        setProjectName,
        openModal,
        closeModal,
        handleCreateProject,
        handleUpdateProject,
        handleDeleteProject,
    };
};
