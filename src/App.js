import React, { Suspense, lazy } from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./pages/admin/Dashboard";
import Profile from "./pages/common/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCustomers from "./pages/admin/AdminCustomers";
import CustomerEdit from "./pages/admin/CustomerEdit"
import AdminProjects from "./pages/admin/AdminProjects";
import AdminTasks from "./pages/admin/AdminTasks";
import TimeTracking from "./pages/common/TimeTracking";
import CustomerSummary from "./pages/admin/CustomerSummary";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Login = lazy(() => import("./pages/common/Login"));

const App = () => {
    return (
        <Router>
            <Header/>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/customers" element={<AdminCustomers />} />
                    <Route path="/customers/:id" element={<CustomerEdit />} />
                    <Route path="/projects" element={<AdminProjects />} />
                    <Route path="/tasks" element={<AdminTasks />} />
                    <Route path="/time-tracking" element={<TimeTracking />} />
                    <Route path="/customer-summary" element={<CustomerSummary />} />
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