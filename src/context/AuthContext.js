import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem("token") || null);
    const [userRole, setUserRole] = useState(localStorage.getItem("role") || "user");

    useEffect(() => {
        console.log("AuthContext Mounted - Token:", authToken, "Role:", userRole);
    }, [authToken, userRole]);

    const login = (token, role) => {
        console.log("Login Called - Storing Token:", token, "Role:", role);
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        setAuthToken(token);
        setUserRole(role);
    };

    const logout = () => {
        console.log("Logout Called - Clearing Token");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setAuthToken(null);
        setUserRole("user");
    };

    return (
        <AuthContext.Provider value={{ authToken, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};