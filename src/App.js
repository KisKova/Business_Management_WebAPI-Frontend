import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import AdminDashboard from "./components/AdminDashboard";
import AdminCustomers from "./components/AdminCustomers";
import CustomerEdit from "./components/CustomerEdit"
import AdminProjects from "./components/AdminProjects";
import AdminTasks from "./components/AdminTasks";
import TimeTracking from "./components/TimeTracking";
import CustomerSummary from "./components/CustomerSummary";

const Login = lazy(() => import("./components/Login"));

const App = () => {
    return (
        <Router>
            <Header/>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
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