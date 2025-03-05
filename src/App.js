import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./components/Dashboard"; // Import default CSS for toastify

const Login = lazy(() => import("./components/Login"));
const App = () => {
    return (
        <Router>
            <Header/>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </Suspense>
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={true}
                closeOnClick
                // pauseOnHover
                theme="colored"
            />
        </Router>
    );
};

export default App;