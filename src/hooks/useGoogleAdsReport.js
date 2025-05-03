import { useEffect, useState } from "react";
import { fetchAllAccounts, createReport } from "../services/googleAdsService";

const useGoogleAdsReport = () => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const selectedMonth = year && month ? `${year}-${month}` : "";

    useEffect(() => {
        const getAccounts = async () => {
            try {
                const response = await fetchAllAccounts();
                setAccounts(response.data.data);
            } catch (err) {
                console.error("Failed to fetch Google Ads accounts", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        getAccounts();
    }, []);

    const handleGenerateReport = async () => {
        if (!selectedAccount || !year || !month) {
            alert("Please select account, year and month");
            return;
        }

        try {
            const response = await createReport(
                selectedAccount.id,
                selectedAccount.name,
                selectedMonth
            );

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Campaign_report_${selectedAccount.name}_${selectedMonth}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Failed to generate report", error);
            alert("Failed to generate report.");
        }
    };

    return {
        accounts,
        selectedAccount,
        setSelectedAccount,
        year,
        setYear,
        month,
        setMonth,
        selectedMonth,
        loading,
        error,
        handleGenerateReport,
    };
};

export default useGoogleAdsReport;
