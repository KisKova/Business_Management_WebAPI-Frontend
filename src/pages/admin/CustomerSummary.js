import { useEffect, useState } from "react";
import { fetchAllCustomers } from "../../services/customerService";
import { fetchCustomerSummary } from "../../services/timeTrackingService";
import { toast } from "react-toastify";

const CustomerSummary = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [summary, setSummary] = useState([]);

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const res = await fetchAllCustomers();
                setCustomers(res.data.data);
            } catch {
                toast.error("Failed to load customers");
            }
        };
        loadCustomers();
    }, []);

    useEffect(() => {
        if (!selectedCustomerId) return;

        const loadSummary = async () => {
            try {
                const res = await fetchCustomerSummary(selectedCustomerId);
                setSummary(res.data.data);
            } catch {
                toast.error("Failed to load summary");
            }
        };
        loadSummary();
    }, [selectedCustomerId]);

    return (
        <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
            <h2>Customer Time Summary</h2>

            <label>Select Customer:</label>
            <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
            >
                <option value="">-- Select --</option>
                {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>

            {summary.length > 0 && (
                <table style={{ width: "100%", marginTop: "2rem", borderCollapse: "collapse" }}>
                    <thead>
                    <tr>
                        <th style={cellStyle}>Month</th>
                        <th style={cellStyle}>Hours Tracked</th>
                        <th style={cellStyle}>Hourly Rate</th>
                        <th style={cellStyle}>Total Cost</th>
                    </tr>
                    </thead>
                    <tbody>
                    {summary.map(row => {
                        const hours = Number(row.total_hours || 0);
                        const rate = Number(row.hourly_fee || 0);
                        const cost = (hours * rate).toFixed(2);
                        const month = new Date(row.month).toLocaleDateString("default", {
                            year: "numeric",
                            month: "long",
                        });

                        return (
                            <tr key={row.month}>
                                <td style={cellStyle}>{month}</td>
                                <td style={cellStyle}>{hours.toFixed(2)}</td>
                                <td style={cellStyle}>${rate.toFixed(2)}</td>
                                <td style={cellStyle}>${cost}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const cellStyle = {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    textAlign: "left"
};

export default CustomerSummary;
