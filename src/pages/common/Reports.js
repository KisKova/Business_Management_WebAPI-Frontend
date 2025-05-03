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
        handleGenerateReport
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
        <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Create Google Ads Report</h2>

            <label className="block font-medium">Select Account</label>
            <select
                value={selectedAccount?.id || ""}
                onChange={(e) => {
                    const account = accounts.find((acc) => acc.id === e.target.value);
                    setSelectedAccount(account || null);
                }}
                className="w-full border p-2 mb-4"
            >
                <option value="">-- Select Account --</option>
                {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.id})
                    </option>
                ))}
            </select>

            <div className="flex gap-4 mb-4">
                <div className="flex-1">
                    <label className="block font-medium">Year</label>
                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full border p-2"
                    >
                        <option value="">-- Year --</option>
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-1">
                    <label className="block font-medium">Month</label>
                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="w-full border p-2"
                    >
                        <option value="">-- Month --</option>
                        {months.map((m) => (
                            <option key={m.value} value={m.value}>
                                {m.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                onClick={handleGenerateReport}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Create Report
            </button>
        </div>
    );
};

export default Reports;

