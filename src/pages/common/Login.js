import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../services/userService";

const Login = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errors] = useState({});
    const navigate=useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await loginUser(identifier, password);
            const token = response.data.data.token;

            localStorage.setItem("authToken", token);
            localStorage.setItem("userData", JSON.stringify(response.data.data.user))

            toast.success("Login successful!");
            navigate('/dashboard')
        } catch (error) {
            console.error("Error during login:", error);
            toast.error(error.response.data.message || "Something went wrong. Please try again later.");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username or email</label>
                    <input
                        type="text"
                        name="identifier"
                        placeholder="Enter your username or email"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                </div>
                <button type="submit" className="login-btn">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;