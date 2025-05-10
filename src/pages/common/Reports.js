import useGoogleAdsReport from "../../hooks/useGoogleAdsReport";

const Reports = () => {
    const {
        accounts,
        selectedAccount,
        setSelectedAccount,
        year,
        setYear,
        month,
        setMonth,
        handleGenerateReport,
    } = useGoogleAdsReport();

    const years = [2023, 2024, 2025];
    const months = [
        { label: "January", value: "01" },
        { label: "February", value: "02" },
        { label: "March", value: "03" },
        { label: "April", value: "04" },
        { label: "May", value: "05" },
        { label: "June", value: "06" },
        { label: "July", value: "07" },
        { label: "August", value: "08" },
        { label: "September", value: "09" },
        { label: "October", value: "10" },
        { label: "November", value: "11" },
        { label: "December", value: "12" },
    ];

    return (
        <div className="admin-container">
            <h2>Google Ads Report</h2>

            <div className="report-card">
                {/* Account Dropdown */}
                <div className="selection-div">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Account:</label>
                    <select
                        value={selectedAccount?.id || ""}
                        onChange={(e) => {
                            const account = accounts.find((acc) => acc.id === e.target.value);
                            setSelectedAccount(account || null);
                        }}
                        className="admin-input"
                    >
                        <option value="">-- Select Account --</option>
                        {accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                                {acc.name} ({acc.id})
                            </option>
                        ))}
                    </select>


                {/* Year & Month */}

                    <label className="block text-sm font-medium text-gray-700 mb-1">Year:</label>
                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="admin-input"
                    >
                        <option value="">-- Year --</option>
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>



                    <label className="block text-sm font-medium text-gray-700 mb-1">Month:</label>
                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="admin-input"
                    >
                        <option value="">-- Month --</option>
                        {months.map((m) => (
                            <option key={m.value} value={m.value}>
                                {m.label}
                            </option>
                        ))}
                    </select>

                {/* Button */}
                    <button
                        onClick={handleGenerateReport}
                        className="profile-button"
                    >
                        Create Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reports;
