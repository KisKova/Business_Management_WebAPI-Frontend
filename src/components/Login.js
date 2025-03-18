import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {loginUser} from "../services/api";

const Login = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errors] = useState({});
    const navigate=useNavigate();

    // Validation function for email and password
    /*const validateForm = () => {
        const errors = {};
        if (!email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Please enter a valid email address";
        }
        if (!password) {
            errors.password = "Password is required";
        }
        return errors;
    };*/

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form fields
        // const validationErrors = validateForm();
        // if (Object.keys(validationErrors).length > 0) {
        //   setErrors(validationErrors);
        //   return;
        // }

        try {
            const response = await loginUser(identifier, password);

            // 2. Extract token from response
            const token = response.data.token;

            localStorage.setItem("authToken", token);
            localStorage.setItem("userData", JSON.stringify(response.data.user))

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