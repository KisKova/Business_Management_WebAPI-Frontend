import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({ identifier: "", password: "" });
    const [message, setMessage] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(formData);
            console.log("Login Response Received:", response.data);

            if (response.data.token) {
                console.log("Calling login() with:", response.data.token, response.data.role);
                login(response.data.token, response.data.role);
                console.log("Navigating to /dashboard");
                navigate("/dashboard"); // ✅ Now handling navigation here
            } else {
                setMessage("Invalid credentials. Please try again.");
            }
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message);
            setMessage("Invalid credentials. Please try again.");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="identifier"
                    placeholder="Username or Email"
                    value={formData.identifier}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
