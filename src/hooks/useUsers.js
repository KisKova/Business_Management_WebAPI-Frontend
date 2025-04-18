// hooks/useUsers.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    fetchAllUsers,
    createUser,
    updateUser,
    changeUserPasswordAdmin,
} from "../services/userService";
import { toast } from "react-toastify";

export const useUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const [userData, setUserData] = useState({
        id: "",
        username: "",
        email: "",
        role: "user",
        is_active: true,
    });

    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        role: "user",
    });

    const [newPasswordData, setNewPasswordData] = useState({
        id: "",
        newPassword: "",
    });

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await fetchAllUsers();
                setUsers(res.data.data);
            } catch {
                toast.error("Failed to fetch users.");
                navigate("/login");
            }
        };
        loadUsers();
    }, [navigate]);

    const openModal = (type, user = null) => {
        setModalType(type);
        setSelectedUser(user);

        if (type === "editUser" && user) {
            setUserData({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                is_active: user.is_active,
            });
        }

        if (type === "changePassword" && user) {
            setNewPasswordData({ id: user.id, newPassword: "" });
        }
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedUser(null);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await createUser(newUser);
            toast.success("User created successfully!");
            closeModal();
            setNewUser({ username: "", email: "", password: "", role: "user" });
            const res = await fetchAllUsers();
            setUsers(res.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error creating user.");
        }
    };

    const handleUserUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateUser(userData);
            toast.success("User updated successfully!");
            closeModal();
            const res = await fetchAllUsers();
            setUsers(res.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating user.");
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        try {
            await changeUserPasswordAdmin(newPasswordData);
            toast.success("Password changed successfully!");
            closeModal();
            setNewPasswordData({ id: "", newPassword: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error changing password.");
        }
    };

    return {
        users,
        modalType,
        selectedUser,
        userData,
        newUser,
        newPasswordData,
        openModal,
        closeModal,
        setUserData,
        setNewUser,
        setNewPasswordData,
        handleCreateUser,
        handleUserUpdate,
        handlePasswordUpdate,
    };
};
