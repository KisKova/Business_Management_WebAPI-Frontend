// hooks/useUsers.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    fetchAllUsers,
    createUser,
    updateUser,
    changeUserPasswordAdmin, changePersonalData, changeUserPassword
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

export const useProfile = () => {
    const [userData, setUserData] = useState(() => {
        const storedUser = localStorage.getItem("userData");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [modalType, setModalType] = useState(null);
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
    const [personalData, setPersonalData] = useState({ username: "", email: "" });

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }
    }, []);

    const openModal = (type) => {
        setModalType(type);
        if (type === "personalData" && userData) {
            setPersonalData({ username: userData.username, email: userData.email });
        }
    };

    const closeModal = () => setModalType(null);

    const handlePasswordChange = (e) => {
        setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePersonalDataChange = (e) => {
        setPersonalData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        try {
            await changeUserPassword(passwords.oldPassword, passwords.newPassword);
            toast.success("Password changed successfully!");
            setPasswords({ oldPassword: "", newPassword: "" });
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error changing password.");
        }
    };

    const handlePersonalDataUpdate = async (e) => {
        e.preventDefault();
        try {
            await changePersonalData(personalData.email, personalData.username);
            toast.success("Personal Info updated successfully!");
            const updatedUserData = { ...userData, ...personalData };
            setUserData(updatedUserData);
            localStorage.setItem("userData", JSON.stringify(updatedUserData));
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error changing personal data.");
        }
    };

    return {
        userData,
        modalType,
        openModal,
        closeModal,
        passwords,
        personalData,
        handlePasswordChange,
        handlePersonalDataChange,
        handlePasswordUpdate,
        handlePersonalDataUpdate
    };
};

