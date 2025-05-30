import { useCustomerSummary } from "../../hooks/useCustomers"; // adjust path as needed

const CustomerSummary = () => {
    const {
        customers,
        selectedCustomerId,
        setSelectedCustomerId,
        summary
    } = useCustomerSummary();

    return (
        <div className="admin-container">
            <h2>Customer Time and Cost Summary</h2>

            <div className="customer-summary-selector">
                <label className="customer-summary-sub-title">Select Customer:</label>
                <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="admin-input"
                >
                    <option value="">-- Select --</option>
                    {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {selectedCustomerId && (
                summary.length > 0 ? (
                    <table className="admin-table">
                        <thead className="admin-thead">
                        <tr>
                            <th>Month</th>
                            <th>Hours Tracked</th>
                            <th>Hourly Rate</th>
                            <th>Total Cost</th>
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
                                <tr key={row.month} className="admin-trow">
                                    <td>{month}</td>
                                    <td>{hours.toFixed(2)}</td>
                                    <td>${rate.toFixed(2)}</td>
                                    <td>${cost}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-500 mt-4">No data available for this customer.</p>
                )
            )}
        </div>
    );
};

export default CustomerSummary;
